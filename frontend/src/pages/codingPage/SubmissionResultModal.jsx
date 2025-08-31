import React from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Loader2 } from 'lucide-react';

// A small helper component for a single test case row
const TestCaseRow = ({ testCase }) => {
  const { id, input, expectedOutput, actualOutput, passed } = testCase;
  return (
    <div className={`p-3 rounded-lg border ${passed ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold text-sm text-foreground">Test Case #{id}</h4>
        {passed ? (
          <span className="flex items-center gap-1.5 text-xs text-green-600 font-medium bg-green-500/20 px-2 py-0.5 rounded-full">
            <CheckCircle2 size={14} /> Passed
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-xs text-red-600 font-medium bg-red-500/20 px-2 py-0.5 rounded-full">
            <XCircle size={14} /> Failed
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
        <div className="bg-background p-2 rounded">
          <p className="font-sans font-semibold text-muted-foreground mb-1">Input</p>
          <pre className="whitespace-pre-wrap">{input}</pre>
        </div>
        <div className="bg-background p-2 rounded">
          <p className="font-sans font-semibold text-muted-foreground mb-1">Your Output</p>
          <pre className="whitespace-pre-wrap">{actualOutput || '(No output)'}</pre>
        </div>
        <div className="bg-background p-2 rounded">
          <p className="font-sans font-semibold text-muted-foreground mb-1">Expected Output</p>
          <pre className="whitespace-pre-wrap">{expectedOutput}</pre>
        </div>
      </div>
    </div>
  );
};

const SubmissionResultModal = ({ isOpen, onClose, result, error, isLoading }) => {
  if (!isOpen) return null;

  const verdictConfig = {
    'ACCEPTED': { icon: <CheckCircle2 size={32} className="text-green-500" />, color: 'text-green-500', text: 'Accepted' },
    'WRONG_ANSWER': { icon: <XCircle size={32} className="text-red-500" />, color: 'text-red-500', text: 'Wrong Answer' },
    'RUNTIME_ERROR': { icon: <AlertTriangle size={32} className="text-yellow-500" />, color: 'text-yellow-500', text: 'Runtime Error' },
    'EVALUATION_FAILED': { icon: <AlertTriangle size={32} className="text-destructive" />, color: 'text-destructive', text: 'Evaluation Failed' },
  };

  const currentVerdict = result ? verdictConfig[result.verdict] : null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-card text-card-foreground rounded-xl border max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Submission Result</h3>
        </div>
        
        <div className="p-6 overflow-y-auto flex-grow">
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground">
              <Loader2 size={48} className="animate-spin" />
              <p className="text-lg font-medium">Submitting and Evaluating...</p>
              <p>The AI is generating test cases and running your code.</p>
            </div>
          )}

          {error && (
             <div className="flex flex-col items-center justify-center h-full gap-4 text-destructive">
                <AlertTriangle size={48} />
                <p className="text-lg font-medium">An Error Occurred</p>
                <p className="text-center">{error}</p>
              </div>
          )}

          {result && !error && currentVerdict && (
            <div className="space-y-6">
              {/* Top Summary Section */}
              <div className="flex flex-col md:flex-row items-center gap-6 p-4 rounded-lg bg-muted">
                <div className="flex-shrink-0">{currentVerdict.icon}</div>
                <div className="flex-grow">
                  <h2 className={`text-2xl font-bold ${currentVerdict.color}`}>{currentVerdict.text}</h2>
                  {result.verdict !== 'RUNTIME_ERROR' && (
                     <p className="text-muted-foreground mt-1">
                        AI-generated tests completed. See the breakdown below.
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-4 text-center md:text-right">
                    <div>
                        <p className="text-xs text-muted-foreground">Success Rate</p>
                        <p className="text-lg font-semibold">{result.successRate || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Avg. Runtime</p>
                        <p className="text-lg font-semibold">{result.avgRuntime || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Avg. Memory</p>
                        <p className="text-lg font-semibold">{result.avgMemory || 'N/A'}</p>
                    </div>
                </div>
              </div>
              
              {/* Test Cases Section */}
              <div className="space-y-3">
                {result.testCases?.map(tc => <TestCaseRow key={tc.id} testCase={tc} />)}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-muted/50 text-right">
            <button
              onClick={onClose}
              className="bg-primary text-primary-foreground h-10 px-4 py-2 rounded-md font-medium"
            >
              Close
            </button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionResultModal;