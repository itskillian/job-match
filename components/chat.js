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
    <>
      <div className="mx-10 my-4 flex">
        <form 
          onSubmit={handlePrompt}
          className="w-full"  
        >
          <input
            type="text"
            placeholder="Enter your prompt..."
            onChange={(e) => setPrompt(e.target.value)}
            required
            className="w-full p-1 rounded-xl dark:text-black"
          />
          <button 
            type="submit" 
            disabled={loading || !prompt.trim()}
            className="absolute mx-1 p-1 rounded-lg bg-slate-500"
          >
            {loading ? 'Generating...' : 'Submit'}
          </button>
        </form>
      </div>
      <div className="mx-10 p-1">
        <p>{response}</p>
      </div>
    </>
  )
}