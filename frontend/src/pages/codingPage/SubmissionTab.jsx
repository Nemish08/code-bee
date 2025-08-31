import React, { useState, useEffect } from 'react';
import { fetchSubmissionsByProblemId } from '../../utils/submissionService';
import { format, formatDistanceToNowStrict } from 'date-fns';
import { useUser } from "@clerk/clerk-react";
// Helper for date formatting
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  // If it's more than a week ago, show 'Mon Day'. Otherwise, show relative time.
  return now - date > 7 * 24 * 60 * 60 * 1000 
    ? format(date, 'MMM d')
    : `${formatDistanceToNowStrict(date)} ago`;
};

// A small component for the status icon and text
const StatusDisplay = ({ status }) => {
  // Assuming a status from the backend like "Accepted" or "Wrong Answer"
  const isAccepted = status == "false" ? 0 : 1;
  const color = isAccepted ? 'text-green-500' : 'text-red-500';
  const text = isAccepted ? 'ACCEPTED' : 'WRONG_ANSWER'; // To match screenshot

  return (
    <div className={`flex items-center gap-2 font-semibold ${color}`}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        {isAccepted ? (
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
        ) : (
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
        )}
      </svg>
      {text}
    </div>
  );
};

const SubmissionsTab = ({ problemId ,submissions}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const {user} = useUser();

  if(submissions.length === 0)return(
    <></>
  );
  return (
    <div className="p-4 text-sm text-text-primary">
      {/* Table Header */}
      <div className="flex justify-between items-center px-2 py-2 text-text-secondary font-semibold border-b border-dark-border">
          <div className="w-1/4">Status</div>
          <div className="w-1/5 text-center">Language</div>
          <div className="w-1/5 text-center">Runtime</div>
          <div className="w-1/5 text-center">Memory</div>
          <div className="w-1/5 text-right">Submitted</div>
      </div>
      {/* Table Body */}
      <div>
        {submissions.submissions.map((sub, index) => (

          <div key={index} className="flex justify-between items-center px-2 py-3 border-b border-dark-border hover:bg-dark-layer-2 cursor-pointer transition-colors">
            <div className="w-1/4"><StatusDisplay status={sub.status} /></div>
            <div className="w-1/5 text-center">{sub.language.charAt(0).toUpperCase() + sub.language.slice(1)}</div>
            <div className="w-1/5 text-center">{sub.runtime ? `${sub.runtime} S` : 'N/A'}</div>
            <div className="w-1/5 text-center">{sub.memory ? `${sub.memory} KB` : 'N/A'}</div>
            <div className="w-1/5 text-right text-text-secondary">{formatDate(sub.submittedAt)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubmissionsTab;