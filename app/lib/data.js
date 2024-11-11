import { sql } from '@vercel/postgres';

export async function fetchFileId(fileHash) {
  try {
    const data = await sql`SELECT file_id FROM file_hashes WHERE file_hash = ${fileHash}`; // TODO
    return data.rows.length > 0 ? data.rows[0].file_id : null;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch file hash data.');
  }
}