import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Background from '../pages/Background';

const styles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.4s ease-out;
  }
  
  .animate-pulse-subtle {
    animation: pulse 2s infinite;
  }
  
  .glass-effect {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.3);
  }
  
  .review-container {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.95));
    backdrop-filter: blur(12px);
    border: 1px solid rgba(203, 213, 225, 0.4);
  }
`;

const AiReview = ({ code, language }) => {
  const [aiReview, setAiReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    setDebugInfo(`Backend URL: ${backendUrl || 'NOT SET'}`);
  }, []);

  const handleAiReview = async () => {
    if (!code || !language) {
      setError('Code and language are required');
      return;
    }

    setLoading(true);
    setError('');
    setAiReview('');
    setIsExpanded(true);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      if (!backendUrl) {
        throw new Error('VITE_BACKEND_URL environment variable is not set');
      }

      const response = await axios.post(
        `${backendUrl}/ai-review`,
        { code, language },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 30000,
        }
      );

      let reviewData = '';
      if (typeof response.data === 'string') {
        reviewData = response.data;
      } else if (response.data && typeof response.data === 'object') {
        reviewData =
          response.data.aiResponse ||
          response.data.review ||
          response.data.message ||
          response.data.result ||
          JSON.stringify(response.data, null, 2);
      }

      if (!reviewData) {
        throw new Error('No review data received from backend');
      }

      setAiReview(reviewData);
    } catch (error) {
      console.error('AI Review Error:', error);

      let errorMessage = 'Error fetching AI review';

      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. Please try again.';
      } else if (error.response) {
        errorMessage = `Server error (${error.response.status}): ${
          error.response.data?.message || error.response.data || error.response.statusText
        }`;
      } else if (error.request) {
        errorMessage = 'No response from server. Check if backend is running.';
      } else {
        errorMessage = error.message || 'Unknown error occurred';
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleMinimize = () => {
    setIsExpanded(false);
    setAiReview('');
    setError('');
  };

  return (
    <div >
      <Background />
      <style>{styles}</style>
      
      <div >
        {!isExpanded && (
          <div className="px-6 py-2">
            <button
              onClick={handleAiReview}
              disabled={loading || !code || !language}
              className={`group relative px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform ${
                loading || !code || !language
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:shadow-xl hover:scale-105 active:scale-95'
              }`}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing Code...
                </span>
              ) : (
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-3 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Get AI Review
                </span>
              )}
              {!(loading || !code || !language) && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              )}
            </button>
          </div>
        )}

        {isExpanded && (
          <div className="p-6 review-container rounded-2xl shadow-2xl border animate-fadeIn relative overflow-hidden max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">AI Code Review</h3>
                  <p className="text-sm text-gray-700 mt-1">Intelligent analysis of your {language} code</p>
                </div>
              </div>

              <button
                onClick={handleMinimize}
                className="p-3 rounded-full hover:bg-red-50 transition-all duration-200 group"
                title="Close Review"
              >
                <svg className="w-6 h-6 text-gray-500 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {loading && (
              <div className="p-12 glass-effect rounded-2xl relative z-10 border border-blue-200">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <svg className="animate-spin h-16 w-16 text-blue-600 mb-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <div className="absolute inset-0 rounded-full bg-blue-100 animate-pulse-subtle"></div>
                  </div>
                  <p className="text-blue-700 font-semibold text-lg">Analyzing your code...</p>
                  <p className="text-blue-600 text-sm mt-2">This may take a few moments</p>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 p-6 bg-red-50 border border-red-200 rounded-2xl relative z-10 shadow-sm">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-red-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-red-800 text-lg">Review Failed</h4>
                    <p className="text-red-700 mt-1 leading-relaxed">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {aiReview && (
              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border border-blue-200 rounded-2xl p-8 shadow-lg relative z-10">
                <div className="glass-effect p-8 rounded-xl shadow-sm">
                  <div className="prose max-w-none prose-headings:text-gray-900 prose-p:text-gray-800 prose-p:leading-relaxed prose-strong:text-gray-900 prose-li:text-gray-800">
                    <ReactMarkdown
                      children={aiReview}
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code({node, inline, className, children, ...props}) {
                          return inline ? (
                            <code className="bg-gray-100 text-pink-600 rounded px-2 py-1 font-mono text-sm font-semibold" {...props}>
                              {children}
                            </code>
                          ) : (
                            <pre className="bg-gray-900 text-green-300 rounded-lg p-4 overflow-x-auto my-4 border border-gray-700">
                              <code className="font-mono text-sm leading-relaxed">{children}</code>
                            </pre>
                          );
                        },
                        h1: ({children}) => <h1 className="text-3xl font-bold text-gray-900 mb-4">{children}</h1>,
                        h2: ({children}) => <h2 className="text-2xl font-semibold text-gray-900 mb-3">{children}</h2>,
                        h3: ({children}) => <h3 className="text-xl font-semibold text-gray-900 mb-2">{children}</h3>,
                        ul: ({children}) => <ul className="list-disc ml-6 space-y-1 text-gray-800">{children}</ul>,
                        ol: ({children}) => <ol className="list-decimal ml-6 space-y-1 text-gray-800">{children}</ol>,
                        li: ({children}) => <li className="text-gray-800 leading-relaxed">{children}</li>,
                        p: ({children}) => <p className="text-gray-800 leading-relaxed mb-4">{children}</p>,
                        strong: ({children}) => <strong className="font-semibold text-gray-900">{children}</strong>,
                        em: ({children}) => <em className="italic text-gray-800">{children}</em>
                      }}
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-between items-center text-sm text-gray-600 bg-white/50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-medium">Review completed</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{new Date().toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AiReview;