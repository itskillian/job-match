import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

export const openai = new OpenAI();

export async function getOrCreateResumeAssistant() {
  const assistantName = 'Resume Assistant'
  // list assistants
  const assistantList = await openai.beta.assistants.list();

  // find resume assistant
  let resumeAssistant = assistantList.data.find(assistant => assistant.name === assistantName);

  // retrieve id
  if (resumeAssistant) {
    console.log('Assistant found, ID:', resumeAssistant.id);
  } else {
    // import instructions
    const filePath = path.join(process.cwd(), 'app', 'openai', 'instructions.txt');
    const instructions = fs.readFileSync(filePath, 'utf-8');
  
    // create new assistant
    resumeAssistant = await openai.beta.assistants.create({
      name: assistantName,
      instructions: instructions,
      tools: [{ type: 'file_search' }],
      tool_resources: {
        file_search: {
          vector_stores: [],
        }
      },
      model: 'gpt-4o-mini'
    });
    
    console.log('New assistant created, ID: ', resumeAssistant.id);
  }

  return resumeAssistant;
}

// TODO
export async function getOrCreateVectorStore(assistant) {
  // if the assistant already has a vector store, return it
  if (assistant.tool_resources?.file_search?.vector_store_ids?.length > 0) {
    return assistant.tool_resources.file_search.vector_store_ids[0];
  }

  // otherwise, create a new vector store and attatch it to the assistant
  const vectorStore = await openai.beta.vectorStores.create({
    name: "resume-assistant-vector-store",
  });
  await openai.beta.assistants.update(assistant.id, {
    tool_resources: {
      file_search: {
        vector_store_ids: [vectorStore.id],
      },
    },
  });
  return vectorStore.id;
}

export async function uploadAssistantFile(file, vectorStoreId) {
  try {
    // console.log(file);
    // upload file using file stream
    console.log('Uploading file to vector store...');
    openaiFile = await openai.files.create({
      file: file,
      purpose: 'assistants',
    });
    const fileId = openaiFile.id
    
    // add file to vector store
    await openai.beta.vectorStores.files.create(vectorStoreId, {
      file_id: fileId,
    });
    console.log('Upload complete.');
    
    return fileId;
  } catch (err) {
    console.error('Error during file upload:', { file, error: err});
    throw new Error(`An unexpected error occurred while uploading the file: ${remoteFileId} - ${err}`);
  }
}

export async function createThread(url, file) {
  const threadFile = await openai.files.create({
    file: file,
    purpose: 'assistants',
  });

  const thread = await openai.beta.threads.create({
    messages: [
      {
        role: 'user',
        content: url,
        attachments: [
          {
            file_id: threadFile.id,
            tools: [{ type: 'file_search' }] 
          }
        ],
      },
    ],
  });

  // console.log(thread.tool_resources?.file_search);
  return thread;
}

export async function runThread(thread, assistant) {
  console.log('Running thread...');
  
  let messages;
  try {
    const run = await openai.beta.threads.runs.createAndPoll(
      thread.id,
      { assistant_id: assistant.id, }
    );

    if (run.status === 'completed') {
      console.log('Run complete');
      messages = await openai.beta.threads.messages.list(
        thread.id,
        { run_id: run.id }
      );
      for (const message of messages.data.reverse()) {
        console.log(`${message.role} > ${message.content[0].text.value}`);
      }
    } else {
      console.log(run.status);
    }
  } catch (err) {
    console.error('Error during run: ', { error: err })
    throw new Error(`An error occurred while running the thread: ${thread.id} - ${err}`);
  }

  return messages;
}

// streaming messages code
// if (streaming) {
//   const stream = await openai.beta.threads.runs.create(
//     thread.id, 
//     { assistant_id: assistant.id, stream: true }
//   );
  
//   for await (const event of stream) {
//     console.log(event);
//   }
// }