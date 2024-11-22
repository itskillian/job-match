// this API endpoint to handle the assistant prompt and response
import { openai, getOrCreateResumeAssistant, createThread, runThread } from '@/app/openai/openai';

export async function POST(req, res) {
  try {
    // parse form data
    const formData = await req.formData();
    const file = formData.get('file');
    const desc = formData.get('desc');

    // get or create assistant
    const assistant = await getOrCreateResumeAssistant();

    // create a thread, thread vector store and upload file to thread vector store
    const thread = await createThread(desc, file);
    // TODO getOrCreateThread

    // run thread
    const threadMessagesData = (await runThread(thread, assistant)).data;

    // TODO request response handling
    return new Response(JSON.stringify({
      data: threadMessagesData,
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    // TODO request error response handling
    return new Response(JSON.stringify({
      error: 'Error processing request',
      details: err.message,
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}

async function hashFile (file) {
  // read and hash file
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  
  // convert to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // Convert buffer to byte array
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // Convert bytes to hex string
  return hashHex;
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