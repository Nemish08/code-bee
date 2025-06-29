import React from 'react';
import { Link } from 'react-router-dom';
import problems from '../problems.json'; // Import our data

const ProblemListPage = () => {
  const problemEntries = Object.entries(problems);

  return (
    <div className="bg-dark-bg min-h-screen text-text-primary p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Problem Set</h1>
      <div className="max-w-2xl mx-auto bg-dark-panel rounded-lg shadow-lg">
        <ul className="divide-y divide-dark-border">
          {problemEntries.map(([id, { title, difficulty }]) => (
            <li key={id}>
              <Link
                to={`/problems/${id}`}
                className="flex justify-between items-center p-6 hover:bg-dark-header transition-colors"
              >
                <span className="text-lg font-semibold">{title}</span>
                <span
                  className={`px-3 py-1 text-sm font-bold rounded-full ${
                    difficulty === 'Easy' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-black'
                  }`}
                >
                  {difficulty}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProblemListPage;