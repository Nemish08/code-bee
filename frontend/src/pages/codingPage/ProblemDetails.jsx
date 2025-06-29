import React, { useState } from 'react';

const ProblemDetails = ({ problem }) => {
  const [activeTab, setActiveTab] = useState('Description');
  const tabs = ['Description', 'Submissions', 'Discussion'];

  return (
    <div className="bg-dark-panel h-full rounded-lg flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-dark-border px-2">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm ${
              activeTab === tab 
                ? 'text-text-primary border-b-2 border-primary' 
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6 overflow-y-auto">
        {activeTab === 'Description' && (
          <div>
            <div className="flex items-center gap-4 mb-4">
              <span className={`text-white text-xs font-bold px-2.5 py-1 rounded-full ${
                  problem.difficulty === 'Easy' ? 'bg-green-500' : 'bg-yellow-500'
                }`}>{problem.difficulty.toUpperCase()}</span>
            </div>
            
            <h1 className="text-xl font-bold text-text-primary mb-4">{problem.title}</h1>

            <p className="text-text-primary mb-6" dangerouslySetInnerHTML={{ __html: problem.description }} />

            <h2 className="text-lg font-semibold text-text-primary mb-3">Examples</h2>

            {problem.examples.map((example, index) => (
              <div key={index} className="bg-dark-code-editor border border-dark-border p-4 rounded-md mb-4">
                <p className="font-mono text-sm"><strong className="text-text-accent">Input:</strong> {example.input}</p>
                <p className="font-mono text-sm mt-2"><strong className="text-green-400">Output:</strong> {example.output}</p>
                {example.explanation && <p className="text-sm mt-2"><strong className="text-purple-400">Explanation:</strong> {example.explanation}</p>}
              </div>
            ))}
          </div>
        )}
         {activeTab === 'Submissions' && <div className="text-center p-8 text-text-secondary">No submissions yet.</div>}
         {activeTab === 'Discussion' && <div className="text-center p-8 text-text-secondary">Discussion forum is empty.</div>}
      </div>
    </div>
  );
};

export default ProblemDetails;