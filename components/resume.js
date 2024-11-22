'use client'

import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function Resume() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState(null);

  // useEffecte

  // TODO
  // update user resume to state and display preview
  
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
    
    try {
      // send request
      const response = await fetch(form.action, {
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
      
      // parse response and update state
      const result = await response.json();
      setMessage(result.data[0].content[0].text.value);

      // format markdown to JSON
      const markdownToJSON = (markdown) => {
        const matchesMarkdown = markdown.match(/Matches:\n([\s\S]*?)(?=^Missing:|$)/m);
        const missingMarkdown = markdown.match(/Missing:\n([\s\S]*)/m);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      form.submit();
    }
  }

  return (
    <>
      <div className="w-full flex justify-center my-4 rounded-xl">
        <form
          action="/api/assistant"
          method="post"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="w-full flex flex-col justify-evenly"
          target="hiddenFrame"
        >
          <div className="p-4 mb-2 border border-gray-100 bg-white rounded-2xl">
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

          <div className="h-[140px] mb-2 border border-gray-100 bg-white rounded-2xl">
            <label htmlFor="desc" className="sr-only">Enter Job Description</label>
            <textarea
              type="text"
              id="desc"
              name="desc"
              placeholder="Enter Job Description..."
              className="
                w-full h-full p-4 rounded-2xl resize-none
                text-sm text-gray-500
                focus:outline focus:outline-1 focus:outline-gray-200
              "
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
            Match Resume
          </button>
          <iframe name="hiddenFrame" className="hidden"></iframe>
        </form>
      </div>
      
      <div className='w-full my-4 rounded-xl'>
        <ReactMarkdown>
          {message}
        </ReactMarkdown>
      </div>
    </>
  )  
}