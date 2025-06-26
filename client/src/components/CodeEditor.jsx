import React, { useState } from 'react';

const CodeEditor = ({ problemId }) => {
  console.log('CodeEditor component rendering with problemId:', problemId);
  
  const [code, setCode] = useState('// Write your code here');
  const [output, setOutput] = useState('');
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('cpp');

  const handleSubmit = () => {
    setOutput('Code execution would happen here');
  };

  return (
    <div className="h-full flex flex-col text-white bg-[#0f172a]">
      <div className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-800 p-4">
        <h2 className="text-xl font-bold text-white">💻 Code Editor</h2>
        <p className="text-gray-400 text-sm">Problem ID: {problemId}</p>
      </div>

      {/* Controls */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            className="w-full sm:w-40 border border-gray-600 rounded-lg py-2 px-4 text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="cpp">C++</option>
            <option value="c">C</option>
            <option value="py">Python</option>
            <option value="java">Java</option>
          </select>

          <button
            onClick={handleSubmit}
            className="flex-1 inline-flex items-center justify-center bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold rounded-lg px-5 py-2 shadow-md transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none"
              viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" />
            </svg>
            Run Code
          </button>
        </div>
      </div>

      {/* Code Editor */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 bg-slate-900 rounded-none shadow-lg overflow-hidden">
          <textarea
            value={code}
            onChange={e => setCode(e.target.value)}
            className="w-full h-full p-4 bg-slate-900 text-white border-none outline-none resize-none"
            style={{
              fontFamily: '"Fira Code", monospace',
              fontSize: 14,
            }}
            placeholder="Write your code here..."
          />
        </div>
      </div>

      {/* Input/Output Section */}
      <div className="flex flex-col lg:flex-row">
        {/* Input */}
        <div className="lg:w-1/2 p-4 border-r border-slate-800">
          <label className="block text-white mb-2 font-semibold">Custom Input (stdin):</label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            className="w-full p-3 rounded-lg bg-slate-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
            rows={3}
            placeholder="Enter input for the program..."
          />
        </div>

        {/* Output */}
        <div className="lg:w-1/2 p-4">
          <label className="block text-white mb-2 font-semibold">Output:</label>
          <div className="bg-green-100 text-black rounded-lg shadow-lg p-4 min-h-[100px]">
            <pre className="whitespace-pre-wrap text-sm">
              {output ? output : '// Your output will be displayed here.'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor; 