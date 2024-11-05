'use client'

import { useState } from 'react';

export default function Resume () {
  const [upload, setUpload] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  /** @param {Event} event */
  function handleSubmit(event) {
    const form = 

    event.preventDefault();
  }

  return (
    <div className="mx-10 my-4 flex">
      <form method="post" encType="multipart/form-data">
        <label htmlFor="file">File</label>
        <input 
          type="file"
          id="file"
          name="file"
          className="rounded-lg"
        />
        <button>Upload</button>
      </form>
    </div>
  )
}