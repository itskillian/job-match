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

export async function getOrCreateVectorStore() {
  const assistant = getOrCreateResumeAssistant();
  // const assistant = await openai.beta.assistants.retrieve(assistantId);

  // if the assistant already has a vector store, return it
  if (assistant.tool_resources?.file_search?.vector_store_ids?.length > 0) {
    return assistant.tool_resources.file_search.vector_store_ids[0];
  }
  // otherwise, create a new vector store and attatch it to the assistant
  const vectorStore = await openai.beta.vectorStores.create({
    name: "sample-assistant-vector-store",
  });
  await openai.beta.assistants.update(assistantId, {
    tool_resources: {
      file_search: {
        vector_store_ids: [vectorStore.id],
      },
    },
  });
  return vectorStore.id;
}