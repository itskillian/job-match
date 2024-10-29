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
    <>
      <form method="post" encType="multipart/form-data">
        <label htmlFor="file">File</label>
        <input type="file" id="file" name="file" />
        <button>Upload</button>
      </form>
    </>
  )
}