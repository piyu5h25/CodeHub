import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import  AiReview from './AiReview';

const CodeEditor = ({ problemId, problemName, sampleInput }) => {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('cpp');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isError, setIsError] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  // ... (all your existing helper functions remain the same)

  // 🔑 Generate storage keys for persistence
  const getStorageKey = (key) => {
    return problemId ? `codeEditor_${problemId}_${key}` : `codeEditor_global_${key}`;
  };

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

  // 💾 Save to localStorage
  const saveToStorage = (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  };

  // 📖 Load from localStorage
  const loadFromStorage = (key, defaultValue = '') => {
    try {
      const saved = localStorage.getItem(key);
      return saved !== null ? saved : defaultValue;
    } catch (error) {
      console.warn('Failed to load from localStorage:', error);
      return defaultValue;
    }
  };

  // ... (all your existing useEffect hooks remain the same)

  // 🔄 Initialize component with saved data
  useEffect(() => {
    const savedLanguage = loadFromStorage(getStorageKey('language'), 'cpp');
    setLanguage(savedLanguage);

    const savedCode = loadFromStorage(getStorageKey(`code_${savedLanguage}`));
    if (savedCode) {
      setCode(savedCode);
    } else {
      setCode(getDefaultCode(savedLanguage));
    }

    const savedInput = loadFromStorage(getStorageKey('input'), sampleInput || '');
    setInput(savedInput);
  }, [problemId, sampleInput]);

  // 🔥 Update code when language changes and save to storage
  useEffect(() => {
    saveToStorage(getStorageKey('language'), language);

    const savedCode = loadFromStorage(getStorageKey(`code_${language}`));
    if (savedCode) {
      setCode(savedCode);
    } else {
      const defaultCode = getDefaultCode(language);
      setCode(defaultCode);
      saveToStorage(getStorageKey(`code_${language}`), defaultCode);
    }
  }, [language, problemId]);

  // 💾 Save code whenever it changes
  useEffect(() => {
    if (code) {
      saveToStorage(getStorageKey(`code_${language}`), code);
    }
  }, [code, language, problemId]);

  // 💾 Save input whenever it changes
  useEffect(() => {
    saveToStorage(getStorageKey('input'), input);
  }, [input, problemId]);

  // 🎯 Set sample input when component mounts or sampleInput changes
  useEffect(() => {
    if (sampleInput && !loadFromStorage(getStorageKey('input'))) {
      setInput(sampleInput);
    }
  }, [sampleInput, problemId]);

  // ... (all your existing handler functions remain the same)

  const handleRunCode = async () => {
    const payload = {
      language,
      code,
      input
    };

    try {
      setLoading(true);
      setIsError(false);
      setSubmitResult(null);

      const response = await fetch(`${import.meta.env.VITE_COMPILER_URL}/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

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
      setSubmitting(true);
      setSubmitResult(null);

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          code,
          language,
          problemId,
        }),
      });

      const result = await response.json();
      console.log('Submit Response:', result);

      const processedResult = {
        verdict: result.verdict || result.status || 'Unknown',
        totalTestcases: result.totalTestcases || result.total_testcases || result.testCases || 0,
        passedTestcases: result.passedTestcases || result.passed_testcases || result.passedTestCases || 0,
        failedTestcase: null,
        executionTime: result.executionTime || result.execution_time || result.time || 'N/A',
        memoryUsed: result.memoryUsed || result.memory_used || result.memory || 'N/A',
        error: result.error || result.compilation_error || null,
        details: result.details || result.message || null
      };

      if (result.failedTestcase || result.failed_testcase) {
        processedResult.failedTestcase = result.failedTestcase || result.failed_testcase;
      } else if (processedResult.passedTestcases < processedResult.totalTestcases && processedResult.totalTestcases > 0) {
        processedResult.failedTestcase = processedResult.passedTestcases + 1;
      }

      if (result.testcases && Array.isArray(result.testcases)) {
        const failedIndex = result.testcases.findIndex(tc => tc.status === 'failed' || tc.status === 'FAILED' || !tc.passed);
        if (failedIndex !== -1) {
          processedResult.failedTestcase = failedIndex + 1;
        }
      }

      setSubmitResult(processedResult);

    } catch (error) {
      console.error('Error submitting solution:', error);
      setSubmitResult({
        verdict: 'Submission Error',
        error: 'Failed to submit solution. Please check your connection and try again.',
        totalTestcases: 0,
        passedTestcases: 0
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ... (all your existing utility functions remain the same)

  const getVerdictColor = (verdict) => {
    switch (verdict?.toLowerCase()) {
      case 'accepted':
      case 'ac':
        return 'text-green-400 border-green-400 bg-green-400/10';
      case 'wrong answer':
      case 'wa':
        return 'text-red-400 border-red-400 bg-red-400/10';
      case 'time limit exceeded':
      case 'tle':
        return 'text-yellow-400 border-yellow-400 bg-yellow-400/10';
      case 'runtime error':
      case 're':
        return 'text-orange-400 border-orange-400 bg-orange-400/10';
      case 'compilation error':
      case 'ce':
        return 'text-purple-400 border-purple-400 bg-purple-400/10';
      case 'memory limit exceeded':
      case 'mle':
        return 'text-blue-400 border-blue-400 bg-blue-400/10';
      default:
        return 'text-gray-400 border-gray-400 bg-gray-400/10';
    }
  };

  const getVerdictIcon = (verdict) => {
    switch (verdict?.toLowerCase()) {
      case 'accepted':
      case 'ac':
        return '🎉';
      case 'wrong answer':
      case 'wa':
        return '❌';
      case 'time limit exceeded':
      case 'tle':
        return '⏰';
      case 'runtime error':
      case 're':
        return '💥';
      case 'compilation error':
      case 'ce':
        return '🔧';
      case 'memory limit exceeded':
      case 'mle':
        return '🧠';
      default:
        return '❓';
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
      

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-4xl mb-2 pt-1">
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
        


        {/* Enhanced Submit Button */}
        <button
          onClick={handleSubmitSolution}
          disabled={submitting || loading}
          className={`flex-1 group relative inline-flex items-center justify-center overflow-hidden rounded-lg px-6 py-2 font-semibold transition-all duration-300 ${
            submitting || loading
              ? 'cursor-not-allowed opacity-60' 
              : 'hover:scale-105 hover:shadow-2xl active:scale-95'
          }`}
        >
          <div className={`absolute inset-0 bg-gradient-to-r transition-all duration-300 ${
            submitting
              ? 'from-blue-600 via-purple-600 to-blue-600 animate-pulse'
              : 'from-emerald-500 via-blue-500 to-purple-500 group-hover:from-emerald-400 group-hover:via-blue-400 group-hover:to-purple-400'
          }`}></div>
          
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          
          <div className="relative flex items-center text-white">
            {submitting ? (
              <>
                <div className="w-5 h-5 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span className="animate-pulse">Judging...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Submit Solution</span>
              </>
            )}
          </div>
          
          <div className={`absolute inset-0 rounded-lg blur-sm transition-all duration-300 ${
            submitting 
              ? 'bg-blue-400/50' 
              : 'bg-gradient-to-r from-emerald-400/50 via-blue-400/50 to-purple-400/50 group-hover:blur-md'
          } -z-10`}></div>
        </button>
        
      


      </div>
          <AiReview code={code} language={language} />
      
      
      
      {/* Submit Result Display */}
      {submitResult && (
        <div className={`w-full max-w-4xl mb-4 rounded-xl p-6 border-2 transition-all duration-500 ${getVerdictColor(submitResult.verdict)}`}>
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{getVerdictIcon(submitResult.verdict)}</span>
              <div>
                <h3 className="text-2xl font-bold">{submitResult.verdict}</h3>
                {submitResult.details && (
                  <p className="text-sm opacity-80 mt-1">{submitResult.details}</p>
                )}
              </div>
            </div>
            {submitResult.verdict.toLowerCase() === 'accepted' && (
              <div className="text-4xl animate-bounce">✨</div>
            )}
          </div>

          {/* Error Message */}
          {submitResult.error && (
            <div className="mb-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
              <h4 className="font-semibold text-red-300 mb-2">Error Details:</h4>
              <pre className="text-sm text-red-200 whitespace-pre-wrap">{submitResult.error}</pre>
            </div>
          )}

          {/* Stats Grid */}
          {!submitResult.error && submitResult.totalTestcases > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="bg-black/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold">
                  {submitResult.passedTestcases}/{submitResult.totalTestcases}
                </div>
                <div className="text-sm opacity-75">Test Cases</div>
              </div>

              <div className="bg-black/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold">{submitResult.executionTime}</div>
                <div className="text-sm opacity-75">Time</div>
              </div>

              <div className="bg-black/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold">{submitResult.memoryUsed}</div>
                <div className="text-sm opacity-75">Memory</div>
              </div>

              <div className="bg-black/20 rounded-lg p-4 text-center">
                <div className="text-lg font-bold">
                  {submitResult.verdict.toLowerCase() === 'accepted' ? '✅ Passed' : '❌ Failed'}
                </div>
                <div className="text-sm opacity-75">Status</div>
              </div>
            </div>
          )}

          {/* Failed Test Case Info */}
          {submitResult.failedTestcase && submitResult.verdict.toLowerCase() !== 'accepted' && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
              <h4 className="font-semibold text-red-300 mb-2">❌ Failed at Test Case #{submitResult.failedTestcase}</h4>
              <p className="text-sm text-red-200">
                Your solution passed {submitResult.passedTestcases} out of {submitResult.totalTestcases} test cases.
                {submitResult.verdict.toLowerCase() === 'wrong answer' && 
                  " Check your logic and edge cases."
                }
                {submitResult.verdict.toLowerCase() === 'time limit exceeded' && 
                  " Your solution is too slow. Try optimizing your algorithm."
                }
                {submitResult.verdict.toLowerCase() === 'runtime error' && 
                  " Your program crashed during execution. Check for array bounds, null pointers, etc."
                }
              </p>
            </div>
          )}

          {/* Success Message */}
          {submitResult.verdict.toLowerCase() === 'accepted' && (
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 text-center">
              <h4 className="font-semibold text-green-300 text-lg mb-2">🎉 Congratulations!</h4>
              <p className="text-green-200">
                Your solution passed all test cases successfully!
              </p>
            </div>
          )}

          {/* AI Review Suggestion for Failed Submissions */}
          {submitResult.verdict.toLowerCase() !== 'accepted' && (
            <div className="mt-4 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🤖</span>
                <div>
                  <h4 className="font-semibold text-blue-300">Need Help?</h4>
                  <p className="text-sm text-blue-200">Use the AI Review button above to get detailed feedback on your code</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

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