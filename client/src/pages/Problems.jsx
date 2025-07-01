import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { problemService } from '../services/problemService';
import Background from './Background';
import { useAuth } from '../context/AuthContext';



const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [difficulty, setDifficulty] = useState('All');
  const [topic, setTopic] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const location = useLocation();
  

  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await problemService.getAllProblems();
        setProblems(data.problems);
      } catch (err) {
        setError('Failed to fetch problems');
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  const difficulties = ['All', ...Array.from(new Set(problems.map(p => p.difficulty)))];
  const topics = ['All', ...Array.from(new Set(problems.map(p => p.Topic)))];

  const filteredProblems = problems.filter(p => {
    return (
      (difficulty === 'All' || p.difficulty === difficulty) &&
      (topic === 'All' || p.Topic === topic)
    );
  });

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

  if(!user){
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return (
    <div className="min-h-screen flex flex-col text-white bg-[#0f172a]">
      <Background/>
      <Navbar />

      <div className="container mx-auto px-4 py-6 max-w-7xl flex flex-col">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-white">
            🚀 Problem Set
          </h1>
          <p className="text-gray-400 mt-2">
            Challenge yourself with our curated collection of coding problems.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-6 mb-6 justify-center">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-300">Difficulty</label>
            <select
              className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
              value={difficulty}
              onChange={e => setDifficulty(e.target.value)}
            >
              {difficulties.map(d => (
                <option key={d} value={d} className="bg-slate-900">
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-300">Topic</label>
            <select
              className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
              value={topic}
              onChange={e => setTopic(e.target.value)}
            >
              {topics.map(t => (
                <option key={t} value={t} className="bg-slate-900">
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Problem Table */}
        <div className="bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-800 shadow-xl flex flex-col">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-300">Loading problems...</span>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-20">
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
                <p className="text-red-400 text-lg">{error}</p>
              </div>
            </div>
          ) : (
            <>
              {/* Table Header */}
              <div className="bg-slate-800/70 px-6 py-4 border-b border-slate-700">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="font-semibold text-gray-200">Problem</div>
                  <div className="font-semibold text-gray-200 hidden md:block">
                    Difficulty
                  </div>
                  <div className="font-semibold text-gray-200 hidden md:block">Topic</div>
                </div>
              </div>

              {/* Table Body with Scroll */}
              <div className="max-h-[500px] overflow-y-auto">
                {filteredProblems.length === 0 ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                          className="w-6 h-6 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-400 text-lg">No problems found</p>
                      <p className="text-gray-500 text-sm mt-1">
                        Try adjusting your filters
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-800">
                    {filteredProblems.map((problem) => (
                      <div
                        key={problem._id || problem.id}
                        className="px-6 py-4 hover:bg-slate-800/50 transition"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                          {/* Problem Name */}
                          <div>
                            <Link
                              to={`/problems/${problem._id || problem.id}`}
                              className="text-white hover:text-pink-400 font-medium group-hover:underline"
                            >
                              {problem.title}
                            </Link>

                            {/* Mobile difficulty & topic */}
                            <div className="md:hidden flex gap-2 mt-2">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(
                                  problem.difficulty
                                )}`}
                              >
                                {problem.difficulty}
                              </span>
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-700/50 text-slate-300 border border-slate-600">
                                {problem.Topic}
                              </span>
                            </div>
                          </div>

                          {/* Difficulty */}
                          <div className="hidden md:block">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(
                                problem.difficulty
                              )}`}
                            >
                              {problem.difficulty}
                            </span>
                          </div>

                          {/* Topic */}
                          <div className="hidden md:block">
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-slate-700/50 text-slate-300 border border-slate-600">
                              {problem.Topic}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer Stats */}
        {!loading && !error && (
          <div className="pt-4 text-center">
            <p className="text-gray-400 text-sm">
              Showing{' '}
              <span className="text-pink-500 font-semibold">
                {filteredProblems.length}
              </span>{' '}
              of{' '}
              <span className="text-pink-500 font-semibold">{problems.length}</span>{' '}
              problems
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Problems;
