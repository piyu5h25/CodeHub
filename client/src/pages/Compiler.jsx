import React, { useState } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
import axios from 'axios';
import '../compiler.css';

const Compiler = () => {
  const [code, setCode] = useState(`
// Include the input/output stream library
#include <iostream> 
using namespace std;

int main() {
    cout << "Hello World!"; 
    return 0; 
}`);
  const [output, setOutput] = useState('');
  const [input, setInput] = useState('');

  const handleSubmit = async () => {
    const payload = {
      language: 'cpp',
      code, 
      input
    };

    try {
      const { data } = await axios.post(import.meta.env.VITE_BACKEND_URL, payload);
      console.log(data);
      setOutput(data.output);
    } catch (error) {
      console.log(error.response);
    }
  }

  return (
    <div className="container mx-auto py-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4 text-white">Codehub Compiler</h1>
      <select className="select-box border border-gray-300 rounded-lg py-1.5 px-4 mb-1 text-green focus:outline-none focus:border-indigo-500 bg-green-200">
        <option value='cpp'>C++</option>
        <option value='c'>C</option>
        <option value='py'>Python</option>
        <option value='java'>Java</option>
      </select>
      <br />
      <div className="bg-gray-100 shadow-md w-full max-w-lg mb-4 text-white" style={{ height: '300px', overflowY: 'auto' }}>
        <Editor
          value={code}
          onValueChange={code => setCode(code)}
          highlight={code => highlight(code, languages.js)}
          padding={10}
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 12,
            outline: 'none',
            border: 'none',
            backgroundColor: '#020618',
            height: '100%',
            overflowY: 'auto'
          }}
        />
      </div>

      <button onClick={handleSubmit} type="button" className="text-center inline-flex items-center text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 hover:cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 me-2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" />
        </svg>
        Run
      </button>
      <div className="w-full max-w-lg mb-4">
      <label className="block text-white mb-1" htmlFor="input-box">Custom Input (stdin):</label>
      <textarea
        id="input-box"
        value={input}
        onChange={e => setInput(e.target.value)}
        className="w-full p-2 rounded bg-gray-900 text-white border border-gray-700"
        rows={4}
        placeholder="Enter custom input here..."
      />
    </div>

      {output &&
        <div className="outputbox mt-4 bg-green-200 text-black rounded-md shadow-md p-4">
          <p style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 12,
          }}>{output}</p>
        </div>
      }
    </div>
  );
}

export default Compiler;