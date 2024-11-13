import { getOrCreateResumeAssistant, openai } from '@/app/openai/openai';
import { getOrCreateVectorStore } from '@/app/openai/openai/';

export async function POST(req, res) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const localFileId = null; // TODO
    const url = formData.get('url');

    // get or create VectorStore //
    const vectorStoreId = await getOrCreateVectorStore();

    // check for local and remote file match
    try {
      const vectorStoreFile = await openai.beta.vectorStores.files.retrieve(
        vectorStoreId,
        localFileId
      );
    } catch (err) {
      // console.dir(err, { depth: null })
      if (
        err.status === 404 &&
        err.message === `404 No file found with id '${localFileId}' in vector store '${vectorStoreId}'.`
      ) {
        console.log(`404 No file found with id '${localFileId}' in vector store '${vectorStoreId}'.`)
      } else {
        throw new Error(`An unexpected error occured while retrieving the vector store file: ${error}`);
      }
    }

    // test error
    if (!file || !url) throw new Error('Missing File or URL from formdata');

    return new Response(JSON.stringify({ message: 'OK' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ message: 'Error', error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function GET(req, res) {
  const assistant = await getOrCreateResumeAssistant();

  //return resumeAssistant
  return Response.json(assistant);
}