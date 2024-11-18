'use client'

import { useState } from 'react';

export default function Resume () {
  const [file, setFile] = useState(null);
  // const [previewUrl, setPreviewUrl] = useState(null);
  // const [url, setUrl] = useState(null);
  // const [response, setResponse] = useState('');
  // const [loading, setLoading] = useState(false);

  // false to disable test API route
  const test = false;

  // TODO
  // fetch user resume from db
  // update to state
  // display preview
  
  async function handleFile (event) {
    // select file and update state
    let inputElement = event.target
    let selectedFile = event.target.files[0];
    setFile(selectedFile);

    // file validation
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5mb
    const FILE_TYPES = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain'
    ];
    
    if (!FILE_TYPES.includes(selectedFile.type)) {
      alert('Invalid file type. Please upload PDF, DOCX, DOC or TXT file.');
      inputElement.value = '';
    } else if (selectedFile.size > MAX_FILE_SIZE) {
      alert('File is too large. Please select a file smaller than 5MB.');
      inputElement.value = '';
    }
  }
  async function handleSubmit (event) {
    const form = event.target;
    event.preventDefault(); // prevent html form submission
    
    // form validation
    const formData = new FormData(form);

    const url = test ? 'api/test' : form.action;
    
    try {
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
        console.log(response);
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
    <div className="flex justify-center mx-6 my-4 p-2 rounded-xl w-full">
      <form
        action="/api/assistant"
        method="post"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="h-[240px] w-full min-w-[320px] max-w-[480px] flex flex-col justify-evenly"
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