import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Background from './Background';
import { problemService } from '../services/problemService';

const ProblemDetail = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
  const [language, setLanguage] = useState('cpp');

  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await problemService.getProblemById(id);
        setProblem(data.problem);
      } catch (err) {
        setError('Failed to fetch problem details');
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [id]);

  const handleSubmit = async () => {
    const payload = {
      language,
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
  };

  const getDifficultyColor = (diff) => {
    switch (diff?.toLowerCase()) {
      case 'easy':
        return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'medium':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'hard':
        return 'text-red-400 bg-red-500/10 border-red-500/20';
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col text-white bg-[#0f172a]">
        <Background />
        <Navbar />
        <div className="flex items-center justify-center flex-1">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-300">Loading problem...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="min-h-screen flex flex-col text-white bg-[#0f172a]">
        <Background />
        <Navbar />
        <div className="flex items-center justify-center flex-1">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-red-400 text-lg">{error || 'Problem not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col text-white bg-[#0f172a]">
      <Background />
      <Navbar />

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Problem Description Panel */}
        <div className="lg:w-1/2 p-6 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            {/* Problem Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-white mb-2">{problem.title}</h1>
              <div className="flex gap-2 mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(
                    problem.difficulty
                  )}`}
                >
                  {problem.difficulty}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-slate-700/50 text-slate-300 border border-slate-600">
                  {problem.Topic}
                </span>
              </div>
            </div>

            {/* Problem Description */}
            <div className="bg-slate-900/60 backdrop-blur-sm rounded-xl border border-slate-800 p-6 mb-6">
              <h2 className="text-xl font-semibold text-white mb-4">Problem Description</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 leading-relaxed mb-4">
                  {problem.description || 'No description available for this problem.'}
                </p>
              </div>
            </div>

            {/* Input/Output Examples */}
            {problem.examples && problem.examples.length > 0 && (
              <div className="bg-slate-900/60 backdrop-blur-sm rounded-xl border border-slate-800 p-6 mb-6">
                <h2 className="text-xl font-semibold text-white mb-4">Examples</h2>
                {problem.examples.map((example, index) => (
                  <div key={index} className="mb-4 last:mb-0">
                    <h3 className="text-lg font-medium text-white mb-2">Example {index + 1}</h3>
                    {example.input && (
                      <div className="mb-2">
                        <span className="text-sm font-medium text-gray-400">Input:</span>
                        <div className="bg-slate-800 rounded-lg p-3 mt-1">
                          <pre className="text-sm text-gray-300">{example.input}</pre>
                        </div>
                      </div>
                    )}
                    {example.output && (
                      <div>
                        <span className="text-sm font-medium text-gray-400">Output:</span>
                        <div className="bg-slate-800 rounded-lg p-3 mt-1">
                          <pre className="text-sm text-gray-300">{example.output}</pre>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Constraints */}
            {problem.constraints && (
              <div className="bg-slate-900/60 backdrop-blur-sm rounded-xl border border-slate-800 p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Constraints</h2>
                <div className="text-gray-300">
                  <pre className="whitespace-pre-wrap text-sm">{problem.constraints}</pre>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Compiler Panel */}
        <div className="lg:w-1/2 p-6 bg-slate-900/30 border-l border-slate-800">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">💻 Code Editor</h2>

            {/* Language Selector and Run Button */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
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

            {/* Code Editor */}
            <div className="bg-slate-900 rounded-xl shadow-lg overflow-hidden mb-4">
              <Editor
                value={code}
                onValueChange={code => setCode(code)}
                highlight={code => highlight(code, languages.js)}
                padding={16}
                style={{
                  fontFamily: '"Fira Code", monospace',
                  fontSize: 14,
                  minHeight: '300px',
                  outline: 'none',
                  border: 'none',
                  color: 'white',
                }}
              />
            </div>

            {/* Input */}
            <div className="mb-4">
              <label className="block text-white mb-2 font-semibold">Custom Input (stdin):</label>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                className="w-full p-3 rounded-lg bg-slate-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
                rows={2}
                placeholder="Enter input for the program..."
              />
            </div>

            {/* Output */}
            <div className="bg-green-100 text-black rounded-lg shadow-lg p-4">
              <h2 className="font-bold mb-2">Output:</h2>
              <pre className="whitespace-pre-wrap text-sm min-h-[60px]">
                {output ? output : '// Your output will be displayed here.'}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemDetail; 