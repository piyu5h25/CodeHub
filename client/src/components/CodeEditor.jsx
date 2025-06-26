import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';

const CodeEditor = ({ problemId, problemName }) => {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('cpp');
  const [loading, setLoading] = useState(false);

  // 🚀 Default Code Template Based on Language
  const getDefaultCode = (lang) => {
    switch (lang) {
      case 'cpp':
        return `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`;
      case 'c':
        return `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`;
      case 'python':
        return `print("Hello, World!")`;
      default:
        return '';
    }
  };

  // 🔥 Update code when language changes
  useEffect(() => {
    setCode(getDefaultCode(language));
  }, [language]);

  const handleSubmit = async () => {
    const payload = {
      language,
      code,
      input
    };

    try {
      setLoading(true);
      const { data } = await axios.post(import.meta.env.VITE_BACKEND_URL, payload);
      setOutput(data.output);
    } catch (error) {
      console.log(error.response);
      setOutput('Error connecting to backend');
    } finally {
      setLoading(false);
    }
  };

  const mapLanguage = () => {
    switch (language) {
      case 'cpp':
      case 'c':
        return 'cpp';
      case 'python':
        return 'python';
      default:
        return 'cpp';
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 flex flex-col items-center">
      {/* Problem Name */}
      {problemName && (
        <h2 className="text-2xl font-semibold mb-4 text-white text-center">
          {problemName}
        </h2>
      )}

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-4xl mb-4">
        <select
          value={language}
          onChange={e => setLanguage(e.target.value)}
          className="w-full sm:w-40 border border-gray-600 rounded-lg py-2 px-4 text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-500"
        >
          <option value="cpp">C++</option>
          <option value="c">C</option>
          <option value="python">Python</option>
        </select>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`flex-1 inline-flex items-center justify-center ${
            loading ? 'opacity-50 cursor-not-allowed' : 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600'
          } text-white font-semibold rounded-lg px-5 py-2 shadow-md transition`}
        >
          {loading ? 'Running...' : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none"
                viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" />
              </svg>
              Run Code
            </>
          )}
        </button>
      </div>

      {/* Code Editor */}
      <div className="w-full max-w-4xl bg-slate-900 rounded-xl shadow-lg overflow-hidden">
        <Editor
          height="380px"
          language={mapLanguage()}
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value)}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: 'Fira Code, monospace',
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>

      {/* Input and Output */}
      <div className="w-full max-w-4xl mt-6 flex gap-4">
        <div className="flex-1">
          <label className="block text-white mb-2 font-semibold">Custom Input (stdin):</label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            className="w-full p-3 rounded-lg bg-slate-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
            rows={4}
            placeholder="Enter input for the program..."
          />
        </div>

        <div className="flex-1 bg-green-100 text-black rounded-lg shadow-lg p-4">
          <h2 className="font-bold mb-2">Output:</h2>
          <pre className="whitespace-pre-wrap text-sm min-h-[60px]">
            {output ? output : '// Your output will be displayed here.'}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
