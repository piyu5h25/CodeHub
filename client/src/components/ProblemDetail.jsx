import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { problemService } from '../services/problemService';
import Background from '../pages/Background';
import EditorNav from './EditorNav';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProblemDetail = ({ problem: propProblem }) => {
  const { id } = useParams();
  const [problem, setProblem] = useState(propProblem || null);
  const [loading, setLoading] = useState(!propProblem);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Only fetch problem if not provided as prop (for standalone usage)
  useEffect(() => {
    if (propProblem) {
      setProblem(propProblem);
      setLoading(false);
      return;
    }

    const fetchProblem = async () => {
      if (!id) {
        setError('No problem ID provided');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const data = await problemService.getProblemById(id);
        if (data.success && data.problem) {
          setProblem(data.problem);
        } else {
          setError(data.message || 'Failed to fetch problem details');
        }
      } catch (err) {
        console.error('Error fetching problem:', err);
        setError('Failed to fetch problem details');
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id, propProblem]);

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
      <div className="h-full flex items-center justify-center text-white bg-[#0f172a]">
        {!propProblem && <Background />}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-300">Loading problem...</span>
        </div>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="h-full flex items-center justify-center text-white bg-[#0f172a]">
        {!propProblem && <Background />}
        <div className="relative z-10 text-center">
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
          <p className="text-gray-500 text-sm mt-2">Problem ID: {id}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  return (
    <div className="h-full flex flex-col text-white bg-[#0f172a] overflow-hidden">
      <Background />
      <EditorNav />
      <style jsx>{`
        /* Custom scrollbar styles */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.3);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(100, 116, 139, 0.5);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(100, 116, 139, 0.7);
        }
        
        /* Firefox scrollbar */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(100, 116, 139, 0.5) rgba(15, 23, 42, 0.3);
        }
      `}</style>
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">{problem.title || 'Untitled Problem'}</h1>
              <div className="flex items-center gap-3 mt-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(
                    problem.difficulty
                  )}`}
                >
                  {problem.difficulty || 'Unknown'}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-slate-700/50 text-slate-300 border border-slate-600">
                  {problem.Topic || 'General'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Problem Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="max-w-none">
            {/* Problem Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">Problem Description</h2>
              <div className="bg-slate-900/60 backdrop-blur-sm rounded-lg border border-slate-800 p-6">
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {problem.description || 'No description available for this problem.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Constraints */}
            {problem.constraints && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">Constraints</h2>
                <div className="bg-slate-900/60 backdrop-blur-sm rounded-lg border border-slate-800 p-6">
                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {problem.constraints}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Sample Input/Output */}
            {problem.sampleInput && problem.sampleOutput && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">Sample Input/Output</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-900/60 backdrop-blur-sm rounded-lg border border-slate-800 p-6">
                    <h3 className="text-lg font-medium text-white mb-3">Sample Input</h3>
                    <pre className="text-green-400 bg-slate-800 rounded p-3 overflow-x-auto custom-scrollbar">
                      {problem.sampleInput}
                    </pre>
                  </div>
                  <div className="bg-slate-900/60 backdrop-blur-sm rounded-lg border border-slate-800 p-6">
                    <h3 className="text-lg font-medium text-white mb-3">Sample Output</h3>
                    <pre className="text-blue-400 bg-slate-800 rounded p-3 overflow-x-auto custom-scrollbar">
                      {problem.sampleOutput}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* Explanation */}
            {problem.explanation && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">Explanation</h2>
                <div className="bg-slate-900/60 backdrop-blur-sm rounded-lg border border-slate-800 p-6">
                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {problem.explanation}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemDetail;