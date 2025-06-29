import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Header from './Header';
import ProblemDetails from './ProblemDetails';
import CodeEditorSection from './CodeEditorSection';
import problems from './problems.json';
import { GiConsoleController } from 'react-icons/gi';

function CodingPage() {
  const { problemId } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(problemId)
    console.log(problems[problemId])
    const foundProblem = problems[problemId];
    if (foundProblem) {
      setProblem({ id: problemId, ...foundProblem });
    } else {
      setProblem(null);
    }
    setLoading(false);
  }, [problemId]);

  if (loading) {
    return <div className="bg-dark-bg text-white h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!problem) {
    // Or render a "404 Not Found" component
    return;
  }

  return (
    <div className="h-full bg-dark-bg font-sans flex flex-col mt-20 items-center">
      <Header problemTitle={problem.title} />
      <main className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 p-4 w-[95%] max-w-screen-2xl">
        <div className="h-full">
          <ProblemDetails problem={problem} />
        </div>
        <div className="h-[calc(100vh-80px)]">
          <CodeEditorSection problem={problem} />
        </div>
      </main>
    </div>
  );
}

export default CodingPage;