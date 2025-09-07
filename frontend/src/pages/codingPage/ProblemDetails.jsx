import React, { useState, useEffect } from 'react';
import AITutor from './AITutor';
import SubmissionsTab from './SubmissionTab';
import { fetchSubmissionsByProblemId } from '../../utils/submissionService';
import { useUser } from "@clerk/clerk-react";
import ReactMarkdown from 'react-markdown';

const ProblemDetails = ({ problem, mycode, setTestCode }) => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('Description');
  const [submissions, setSubmissions] = useState([]);
  const [smartDocs, setSmartDocs] = useState({ content: '', loading: false, error: null });

  // Check if we're in a contest
  const isContest = new URLSearchParams(window.location.search).has('contestId');
  
  // Contest mode only shows description tab
  const tabs = isContest ? ['Description'] : ['Description', 'AI Tutor', 'Smart Docs', 'Submissions'];

  useEffect(() => {
    const loadSubmissions = async () => {
      if (!problem || !user || isContest) return; 
      try {
        const data = await fetchSubmissionsByProblemId(problem.id, user.id);
        setSubmissions(data);
      } catch (err) {
        console.error("Failed to fetch submissions:", err);
      }
    };
    
    const loadSmartDocs = async () => {
        if (!problem || smartDocs.content || isContest) return;
        setSmartDocs({ content: '', loading: true, error: null });
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/problems/${problem.id}/smart-docs`);
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to fetch Smart Docs');
            setSmartDocs({ content: data.smartDocs, loading: false, error: null });
        } catch(err) {
            setSmartDocs({ content: '', loading: false, error: err.message });
        }
    };

    if (activeTab === 'Submissions') {
      loadSubmissions();
    } else if (activeTab === 'Smart Docs') {
        loadSmartDocs();
    }
  }, [activeTab, problem, user, smartDocs.content, isContest]);

  if (!problem) {
    return (
      <div className="bg-dark-panel h-full rounded-lg flex flex-col items-center justify-center">
        <div className="text-text-secondary animate-pulse">Loading Problem...</div>
      </div>
    );
  }

  return (
    <div className="bg-dark-panel h-screen rounded-lg flex flex-col">
      {/* Tabs */}
      {!isContest && (
        <div className="flex-shrink-0 border-b border-dark-border px-2">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 cursor-pointer py-2.5 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'text-text-primary border-b-2 border-primary'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      {/* Content Pane */}
      <div className="flex-grow overflow-y-auto">
        {activeTab === 'Description' && (
          <div className="p-6 h-full">
            <div className="flex items-center gap-4 mb-4">
              <span className={`text-white text-xs font-bold px-2.5 py-1 rounded-full ${
                problem.difficulty === 'Easy' ? 'bg-green-500' : 
                problem.difficulty === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'
              }`}>
                {problem.difficulty.toUpperCase()}
              </span>
            </div>
            
            <h1 className="text-xl font-bold text-text-primary mb-4">{problem.title}</h1>
            <div className="prose prose-invert max-w-none text-text-primary mb-6" dangerouslySetInnerHTML={{ __html: problem.description }}/>
            
            <h2 className="text-lg font-semibold text-text-primary mb-3">Examples</h2>
            {problem.examples.map((example, index) => (
              <div key={index} className="bg-dark-code-editor border border-dark-border p-4 rounded-md mb-4">
                <p className="font-mono text-sm"><strong className="text-text-accent">Input:</strong> {example.input}</p>
                <p className="font-mono text-sm mt-2"><strong className="text-green-400">Output:</strong> {example.output}</p>
                {example.explanation && (
                  <p className="text-sm mt-2 text-text-secondary">
                    <strong className="text-purple-400">Explanation:</strong> {example.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'AI Tutor' && !isContest && (
          <AITutor problem={problem} problemId={problem.id} myCode={mycode}/>
        )}
        
        {activeTab === 'Smart Docs' && !isContest && (
          <div className="p-6 h-full">
            {smartDocs.loading && <p>Generating your study guide with AI...</p>}
            {smartDocs.error && <p className="text-red-500">Error: {smartDocs.error}</p>}
            {smartDocs.content && (
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown>{smartDocs.content}</ReactMarkdown>
              </div>
            )}
          </div>
        )}

        {activeTab === 'Submissions' && !isContest && (
          <div className="w-full h-full">
            <SubmissionsTab 
              submissions={submissions}
              problemId={problem.id}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemDetails;