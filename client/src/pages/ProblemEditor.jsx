import React from 'react';
import { useParams } from 'react-router-dom';
import Split from 'react-split';
import ProblemDetail from './ProblemDetail';
import CodeEditor from '../components/CodeEditor';
import Background from './Background';
import './split.css'; 

const ProblemEditor = () => {
  const { id } = useParams();

  console.log('ProblemEditor rendering with id:', id);

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
              <ProblemDetail />
            </div>

            {/* Code Editor Panel */}
            <div>
              <CodeEditor problemId={id} />
            </div>
          </Split>
        </div>
      </div>
    </div>
  );
};

export default ProblemEditor;
