import { sql } from '@vercel/postgres';

export async function fetchFileId(fileHash) {
  try {
    console.log('Searching for file match in db...')
    const data = await sql`SELECT file_id FROM file_hashes WHERE file_hash = ${fileHash}`;
    if (data.rows.length > 0) {
      console.log('File match found in db.')
      return data.rows[0].file_id;
    } else {
      console.log('No file match in db.')
      return null; 
    }
  } catch (err) {
    console.error('Database error fetching file ID:', {fileHash, error: err });
    throw new Error(`Failed to fetch file data for fileHash: ${fileHash} - ${err}`);
  }
}

export async function insertFileData(fileId, fileHash) {
  try {
    console.log('Inserting file to database...');
    const data = await sql`INSERT INTO file_hashes (file_id, file_hash) VALUES (${fileId}, ${fileHash})`;
    return data;
  } catch (err) {
    console.error('Database error during file insertion:', { fileId, fileHash, error: err });
    throw new Error(`Failed to insert file data for fileId: ${fileId} - ${err}`);
  }
}