// this API endpoint handles submitting data (file and url) to the assistant
import { fetchFileId } from '@/app/lib/data';
import { openai } from '@/app/openai';

const assistantId = 'asst_xR5uh1Sq1FuBztwi5uCxnBTi';

export async function POST(req, res) {
  try {
    // parse form data
    const formData = await req.formData();
    const url = formData.get('url');
    const file = formData.get('file');
    const fileHash = formData.get('filehash');
    
    // get or create VectorStore
    const vectorStoreId = await getOrCreateVectorStore();
    
    // check remote file match exists
    let fileId = await fetchFileId(fileHash);
    
    // if no file match, upload form file
    let openaiFile;
    if (!fileId) {
      try {
        // upload file using file stream
        console.log('Uploading file to vector store...');
        openaiFile = await openai.files.create({
          file: file,
          purpose: 'assistants',
        });
        // add file to vector store
        await openai.beta.vectorStores.files.create(vectorStoreId, {
          file_id: openaiFile.id,
        });
        // update fileId
        fileId = openaiFile.id;
        console.log('Upload complete.');
      } catch (err) {
        throw new Error(`An unexpected error occured while uploading the file to vector store: ${err}`)
      }
    }
    
    console.log('fileId:', fileId);

    // TODO
    // send prompt to assistant
      // fileId
      // url
    
    let vectorStoreFile;
    try {
      // try retrieve remote file
      console.log('Searching for remote file match...')
      vectorStoreFile = await openai.beta.vectorStores.files.retrieve(
        vectorStoreId,
        fileId
      );
      console.log('Match Found.')
    } catch (err) {
      
    }
    
    return new Response(JSON.stringify({
      message: 'File and URL processed successfully',
      fileId: openaiFile.id,
      vectorStoreId: vectorStoreId,
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({
      message: 'Error processing request',
      error: err.message,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

//list files in assistant's vector store
export async function GET() {
  const vectorStoreId = await getOrCreateVectorStore();
  const fileList = await openai.beta.vectorStores.files.list(vectorStoreId);

  const filesArray = await Promise.all(
    fileList.data.map(async (file) => {
      const fileDetails = await openai.files.retrieve(file.id);
      const vectorFileDetails = await openai.beta.vectorStores.files.retrieve(
        vectorStoreId,
        file.id
      );
      return {
        file_id: file.id,
        filename: fileDetails.filename,
        status: vectorFileDetails.status,
      };
    })
  );
  return Response.json(filesArray);
}

// delete file from assistant's vector store
export async function DELETE(request) {
  const body = await request.json();
  const fileId = body.fileId;

  const vectorStoreId = await getOrCreateVectorStore(); // get or create vector store
  await openai.beta.vectorStores.files.del(vectorStoreId, fileId); // delete file from vector store

  return new Response();
}

//helper
// getOrCreateAssistant = async () => {
  // }

// helper
export async function getOrCreateVectorStore() {
  //const assistantId = getOrCreateAssistant();
  const assistant = await openai.beta.assistants.retrieve(assistantId);

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
};