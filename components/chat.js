'use client'

import { useState } from 'react';

export default function Chat() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  // function to handle form submission
  const handlePrompt = async (e) => {
    e.preventDefault(); // prevent page reload
    setLoading(true); // start loading state
    setResponse('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      if (res.ok) {
        setResponse(data.result); // update response
      } else {
        setResponse(data.error || 'Error generating response');
      }
    } catch (error) {
      setResponse('Failed to connect to the API');
    } finally {
        setLoading(false); // stop loading state
    }
  };

  return (
    <div className="min-w-[320px] sm:w-4/5 mx-auto">
      <div className="mx-10 my-4 flex">
        <form onSubmit={handlePrompt}>
          <input
            type="text"
            placeholder="Enter your prompt..."
            onChange={(e) => setPrompt(e.target.value)}
            required
            className="w-full dark:text-black"
          />
          <button 
            type="submit" 
            disabled={loading || !prompt.trim()}
            className="mx-1"
          >
            {loading ? 'Generating...' : 'Submit'}
          </button>
        </form>
      </div>
      <div className="mx-10 p-1">
        <p>{response}</p>
      </div>
    </div>
  )
}