// src/components/ProblemDetails.jsx
import React, { useState } from 'react';

const ProblemDetails = () => {
  const [activeTab, setActiveTab] = useState('Description');
  const tabs = ['Description', 'Submissions', 'Discussion', 'Hints'];

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
              <span className="bg-secondary text-white text-xs font-bold px-2.5 py-1 rounded-full">EASY</span>
              <span className="text-text-secondary text-sm">20 Submissions</span>
              <span className="text-text-secondary text-sm">0% Success</span>
            </div>

            <p className="text-text-primary mb-6">
              Given an integer n, determine whether it is even or odd. Print 'Even' if the number is even, otherwise print 'Odd'.
            </p>

            <h2 className="text-lg font-semibold text-text-primary mb-3">Examples</h2>

            {/* Example 1 */}
            <div className="bg-dark-code-editor border border-dark-border p-4 rounded-md mb-4">
              <p className="text-sm"><strong className="text-text-accent">Input:</strong> 4</p>
              <p className="text-sm mt-2"><strong className="text-green-400">Output:</strong> Even</p>
              <p className="text-sm mt-2"><strong className="text-purple-400">Explanation:</strong> 4 is divisible by 2, so it is even.</p>
            </div>

            {/* Example 2 */}
            <div className="bg-dark-code-editor border border-dark-border p-4 rounded-md">
              <p className="text-sm"><strong className="text-text-accent">Input:</strong> 7</p>
              <p className="text-sm mt-2"><strong className="text-green-400">Output:</strong> Odd</p>
            </div>
          </div>
        )}
         {activeTab === 'Submissions' && <div className="text-center p-8">No submissions yet.</div>}
         {activeTab === 'Discussion' && <div className="text-center p-8">Discussion forum is empty.</div>}
         {activeTab === 'Hints' && <div className="text-center p-8">No hints available for this problem.</div>}
      </div>
    </div>
  );
};

export default ProblemDetails;