import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';

const CodeEditor = ({ problemId, problemName, sampleInput }) => {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('cpp');
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false); // Track if output is an error

  // 🚀 Default Code Template Based on Language
  const getDefaultCode = (lang) => {
    switch (lang) {
      case 'cpp':
        return `#include <iostream>
using namespace std;

int main() {
    cout << "Hello from C++" << endl;
    return 0;
}`;
      case 'c':
        return `#include <stdio.h>

int main() {
    printf("Hello from C\\n");
    return 0;
}`;
      case 'python':
        return `print("Hello from Python")`;
      case 'java':
        return `public class Main {
      public static void main(String[] args) {
        System.out.println("Hello from Java");
      }
    }`;
      default:
        return '';
    }
  };

  // 🔥 Update code when language changes
  useEffect(() => {
    setCode(getDefaultCode(language));
  }, [language]);

  // 🎯 Set sample input when component mounts or sampleInput changes
  useEffect(() => {
    if (sampleInput) {
      setInput(sampleInput);
    }
  }, [sampleInput]);

  const handleRunCode = async () => {
    const payload = {
      language,
      code,
      input
    };

    try {
      setLoading(true);
      setIsError(false);

      const response = await axios.post(`${import.meta.env.VITE_COMPILER_URL}/run`, payload);
      const data = response.data;

      if (data.error) {
        setIsError(true);
        setOutput(data.error);
      } else if (data.output) {
        setIsError(false);
        setOutput(data.output);
      } else {
        setIsError(false);
        setOutput('Program executed successfully with no output.');
      }

    } catch (error) {
      setIsError(true);
      setOutput('Error executing code: ' + error.message);
    } finally {
      setLoading(false);
    }
};

const handleSubmitSolution = async () => {
  try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/submit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              code,
              language,
              problemId,
          }),
      });

      const result = await response.json();
      console.log(result);
      alert(`Verdict: ${result.verdict}`);
  } catch (error) {
      console.error('Error submitting solution:', error);
      alert('Submission failed. Please try again.');
  }
};

  // Function to load sample input
  const loadSampleInput = () => {
    if (sampleInput) {
      setInput(sampleInput);
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
    <div className="container mx-auto pt-2 px-4 flex flex-col items-center">
      {/* Problem Name */}
      {problemName && (
        <h2 className="text-xl font-semibold mb-4 text-white text-center">
          <span className="text-gray-300">Problem: </span>
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
          <option value="java">Java</option>
        </select>

        

        <button
          onClick={handleRunCode}
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
        <button
          onClick={handleSubmitSolution}
          disabled={loading}
          className={`flex-1 inline-flex items-center justify-center ${
            loading ? 'opacity-50 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600'
          } text-white font-semibold rounded-lg px-5 py-2 shadow-md transition`}
        >
          {loading ? 'Submitting...' : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none"
                viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Submit Solution
            </>
          )}
        </button>
      </div>

      {/* Code Editor */}
      <div className="w-full max-w-4xl bg-slate-900 rounded-xl shadow-lg overflow-hidden">
        <Editor
          height="514px"
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
      <div className="w-full max-w-4xl pt-2 flex gap-4">
        <div className="flex-1">
          <label className="block text-white font-semibold">
            Custom Input (stdin):
            {sampleInput && (
              <span className="text-sm text-gray-400 ml-2">
                (Sample input auto-loaded)
              </span>
            )}
          </label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            className="w-full px-3 rounded-lg bg-slate-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
            rows={2}
            placeholder="Enter input for the program..."
          />
        </div>

        <div className="flex-1">
          <label className="block text-white font-semibold">
            {isError ? 'Error:' : 'Output:'}
          </label>
          <pre className={`w-full px-3 min-h-[48px] rounded-lg text-white border focus:outline-none focus:ring-2 focus:ring-pink-500 ${
            isError 
              ? 'bg-red-900 border-red-600 text-red-200' 
              : 'bg-gradient-to-r from-green-500 to-green-700 border-gray-700'
          }`}>
            {output ? output : '// Your output will be displayed here.'}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;