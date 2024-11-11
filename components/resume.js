'use client'

import { useEffect, useState } from 'react';

export default function Resume () {
  const [file, setFile] = useState(null);
  const [fileHash, setFileHash] = useState(null);
  // const [previewUrl, setPreviewUrl] = useState(null);
  // const [url, setUrl] = useState(null);
  // const [response, setResponse] = useState('');
  // const [loading, setLoading] = useState(false);

  // false to disable test API route
  const test = false;

  // form validation TODO
  // TODO
  // if file user file exists on server
    // update to state
    // display preview

  async function hashFile (file) {
    // read and hash file
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    
    // convert to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // Convert buffer to byte array
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // Convert bytes to hex string
    return hashHex;
  }

  async function handleFile (event) {
    // select file and update state
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    // hash file
    if (selectedFile) {
      const hash = await hashFile(selectedFile);
      setFileHash(hash);
      console.log('File Hash:', hash);
    }
  }

  async function handleSubmit (event) {
    const form = event.target;
    event.preventDefault(); // prevent html form submission
    
    const formData = new FormData(form);
    const url = test ? 'api/test' : form.action;

    
    try {
      // add file hash to request body 
      formData.append('fileHash', fileHash); // TODO move this to api/assistant

      // send request
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json'
        }
      });
      
      // check if response is between 200-299
      // TODO improve error prop
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // check response data
      const data = await response.json();
      console.log('Form success:', data);
    } catch (err) {
      console.error('Fetch error:', err);
      form.submit();
    }
  }

  return (
    <div className="mx-6 my-4 p-2 rounded-xl">
      <form
        action="/api/assistant"
        method="post"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="h-[400px] flex flex-col justify-center items-stretch"
        target="hiddenFrame"
      >
        <div className="p-4 mb-1 border border-gray-100 bg-white rounded-2xl">
          <label htmlFor="file" className="sr-only">Choose file</label>
          <input
            type="file"
            id="file"
            name="file"
            onChange={handleFile}
            className="w-full text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-gray-700
            hover:file:bg-blue-100"
          />
        </div>

        <div className="mb-1 border border-gray-100 bg-white rounded-2xl">
          <label htmlFor="url" className="sr-only">Choose file</label>
          <input
            type="text"
            id="url"
            name="url"
            placeholder="Job Listing URL..."
            className="w-full h-full rounded-2xl p-4 focus:outline focus:outline-1 focus:outline-gray-200"
          />
        </div>

        <button 
          type="submit" 
          className="
            p-4 rounded-xl 
            bg-indigo-50 text-indigo-400 text-sm font-bold
            hover:bg-indigo-100
            focus:ring-2 focus:ring-inset ring-white transition
          "
        >
          Optimize Resume
        </button>
        <iframe name="hiddenFrame" className="hidden"></iframe>
      </form>
    </div>
  )
}