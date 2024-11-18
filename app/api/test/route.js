import { openai, getOrCreateResumeAssistant, createThread, runThread } from '@/app/openai/openai';

export async function POST(req, res) {
  try {
    // parse form data
    const formData = await req.formData();
    const file = formData.get('file');
    const url = formData.get('url');

    // get or create assistant
    const assistant = await getOrCreateResumeAssistant();

    // create a thread, vector store and upload file
    const thread = await createThread(url, file);

    // run thread
    const run = await runThread(thread, assistant);
  } catch (err) {
    console.error('Error occured:', err);
    throw err;
  }
  return new Response(JSON.stringify({
    message: 'Succesfully ran thread',
    thread: thread.id,
    vectorStoreId: vectorStoreId,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function GET(req, res) {
  // get or create assistant
  const assistant = await getOrCreateResumeAssistant();
  
  //return resumeAssistant
  return Response.json(assistant);
}