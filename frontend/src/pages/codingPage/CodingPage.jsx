// src/App.jsx
import React from 'react';
import Header from './Header';
import ProblemDetails from './ProblemDetails';
import CodeEditorSection from './CodeEditorSection';


function CodingPage() {
  return (
    <div className="h-full bg-dark-bg font-sans flex flex-col pt-24 items-center justify-center">
      <Header />
      <main className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 p-4 w-[90%]">
        {/* Left Side: Problem Details */}
        <div className="h-full">
          <ProblemDetails />
        </div>
        {/* Right Side: Code Editor */}
        <div className="h-[calc(100vh-80px)]"> {/* Adjust height to fit screen nicely */}
          <CodeEditorSection /> 
        </div>
      </main>
    </div>
  );
}

export default CodingPage;