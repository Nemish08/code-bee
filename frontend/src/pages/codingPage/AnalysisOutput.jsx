import React from 'react';

const AnalysisOutput = ({ result, error, isLoading }) => {
  const renderContent = () => {
    if (isLoading) {
      return <p className="text-muted-foreground animate-pulse">AI is analyzing your code...</p>;
    }

    if (error) {
      return <pre className="text-destructive whitespace-pre-wrap">{error}</pre>;
    }

    if (result) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Column: Input & Output */}
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-muted-foreground mb-1 text-xs font-sans font-semibold">INPUT USED</p>
              <pre className="bg-background/50 rounded p-2 text-foreground whitespace-pre-wrap">{result.input || "No input provided."}</pre>
            </div>
            <div>
              <p className="text-muted-foreground mb-1 text-xs font-sans font-semibold ">GENERATED OUTPUT</p>
              <pre className="bg-background/50 rounded p-2 text-foreground whitespace-pre-wrap truncate">{result.output || "(No output was generated)"}</pre>
            </div>
          </div>

          {/* Right Column: Analysis */}
          <div className="flex flex-col gap-3">
            <div>
                <p className="text-muted-foreground mb-1 text-xs font-sans font-semibold">COMPLEXITY</p>
                <div className="bg-background/50 rounded p-2 text-foreground flex items-center gap-4">
                    <p>Time: <span className="font-semibold">{result.timeComplexity || "N/A"}</span></p>
                    <p>Space: <span className="font-semibold">{result.spaceComplexity || "N/A"}</span></p>
                </div>
            </div>
            <div>
              <p className="text-muted-foreground mb-1  text-xs font-sans font-semibold">AI FEEDBACK & ERRORS</p>
              <div className={`bg-background/50 rounded p-2 overflow-scroll ${result.error ? 'text-destructive' : 'text-foreground'}`}>
                {result.error ? 
                    <pre className="whitespace-pre-wrap">{result.error}</pre> : 
                    <p>No errors found. Well done!</p>
                }
              </div>
            </div>
          </div>
        </div>
      );
    }

    return <p className="text-muted-foreground/50">Execution analysis will appear here.</p>;
  };

  return (
    <div className="bg-muted ring-border mb-4 rounded-lg p-4 text-sm font-mono ring-1 min-h-[160px]">
      {renderContent()}
    </div>
  );
};

export default AnalysisOutput;