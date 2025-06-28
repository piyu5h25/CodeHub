import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Split from 'react-split';
import ProblemDetail from './ProblemDetail';
import CodeEditor from '../components/CodeEditor';
import Background from './Background';
import { problemService } from '../services/problemService';
import './split.css'; 

const ProblemEditor = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log('ProblemEditor rendering with id:', id);

  // Fetch problem data at the parent level
  useEffect(() => {
    const fetchProblem = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await problemService.getProblemById(id);
        if (data.success && data.problem) {
          setProblem(data.problem);
        }
      } catch (err) {
        console.error('Error fetching problem:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-white bg-[#0f172a]">
        <Background />
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-300">Loading problem...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col text-white bg-[#0f172a] overflow-hidden">
      <Background />
      
      <div className="relative z-10 flex flex-col h-full">
        {/* Split Container */}
        <div className="flex-1 overflow-hidden">
          <Split
            sizes={[50, 50]}
            minSize={300}
            className="split" 
          >
            {/* Problem Detail Panel */}
            <div>
              <ProblemDetail problem={problem} />
            </div>

            {/* Code Editor Panel */}
            <div>
              <CodeEditor 
                problemId={id} 
                problemName={problem?.title}
                sampleInput={problem?.sampleInput}
              />
            </div>
          </Split>
        </div>
      </div>
    </div>
  );
};

export default ProblemEditor;