// this API endpoint handles form submission to the assistant
import { fetchFileId, insertFileData } from '@/app/lib/data';
import { openai } from '@/app/openai';

const assistantId = 'asst_xR5uh1Sq1FuBztwi5uCxnBTi'; // TODO make into util function

export async function POST(req, res) {
  try {
    // parse form data
    const formData = await req.formData();
    const file = formData.get('file');
    const url = formData.get('url');

    // hash the file
    const fileHash = await hashFile(file);
    console.log('File Hash:', hash);
    
    // check file match exists in db
    let localFileId;
    try {
      localFileId = await fetchFileId(fileHash);
    } catch (err) {
      console.error(err)
      throw err;
    }

    // get or create VectorStore
    const vectorStoreId = await getOrCreateVectorStore();
    
    let vectorStoreFile;
    if (localFileId) {
      // check file match exists in vector store
      try {
        // try retrieve remote file
        console.log('Searching for file match in vector store...')
        vectorStoreFile = await openai.beta.vectorStores.files.retrieve(
          vectorStoreId,
          localFileId
        );
        vectorStoreFile ? console.log('File match found in vector store.') : console.log('No file match in vector store.');
      } catch (err) {
        console.error();
      }
    }

    // if no file match in vector store, upload form file and add data to db
    let remoteFileId;
    if (!vectorStoreFile) {
      let uploadFile;
      try {
        // upload file using file stream
        console.log('Uploading file to vector store...');
        uploadFile = await openai.files.create({
          file: file,
          purpose: 'assistants',
        });
        
        // add file to vector store
        await openai.beta.vectorStores.files.create(vectorStoreId, {
          file_id: uploadFile.id,
        });
        console.log('Upload complete.');
        remoteFileId = uploadFile.id
        
        // insert file data into db
        console.log('Inserting file data into database...')
        await insertFileData(remoteFileId, fileHash);
        console.log('Insertion complete.');
      } catch (err) {
        console.error('Error during file upload:', { remoteFileId, fileHash, error: err});
        throw new Error(`An unexpected error occured while uploading the file: ${remoteFileId} - ${err}`);
      }
    }
    
    // TODO
    // send prompt to assistant
    const fileId = remoteFileId ? remoteFileId : localFileId;

    // TODO request success response handling
    return new Response(JSON.stringify({
      message: 'File and URL processed successfully',
      fileId: fileId,
      vectorStoreId: vectorStoreId,
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    // TODO request error response handling
    return new Response(JSON.stringify({
      message: 'Error processing request',
      error: err.message,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
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
}