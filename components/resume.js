'use client'

import { useState } from 'react';

export default function Resume () {
  const [resume, setResume] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  // async function handleSubmit (event) {
  //   // setLoading(true); // start loading state
  //   // setResponse('');
  //   const form = event.target;
  //   const url = new URL(form.action);
  //   const formData = new FormData(form);
  //   const searchParameters = new URLSearchParams(formData);
    

  //   console.log("Form submitted")
  //   event.preventDefault();
  // }

  return (
    <div className="mx-6 my-4 p-2 rounded-xl">
      <form
        action="/api/assistants/files"
        method="post"
        // onSubmit={handleSubmit}
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
            type="url"
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