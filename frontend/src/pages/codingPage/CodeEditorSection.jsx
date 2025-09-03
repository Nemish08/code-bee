import React, { useState, useEffect, useCallback, useRef } from 'react';
import AceEditor from 'react-ace';
import { RefreshCcw, CaseSensitive, Play} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { Range } from "ace-builds/src-noconflict/ace";
import throttle from 'lodash/throttle';
import {useUser} from '@clerk/clerk-react';
// Utility and Components
import analyzeCodeWithGemini from '../../utils/analyzeCodeWithGemini';
import AnalysisOutput from './AnalysisOutput';
import evaluateSolution from '../../utils/evaluateSolution';
import { updateProblemStatus } from '../../utils/updateProblemStatus';
import SubmissionResultModal from './SubmissionResultModal';
import {useProctoring} from '../../context/ProctoringContext';
import { useCode } from '../../context/CodeContext';
// Ace Editor Configs
import ace from 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/ext-language_tools';
import { useLocation } from 'react-router-dom';

ace.config.set("basePath", "https://cdn.jsdelivr.net/npm/ace-builds@1.33.0/src-noconflict/");

// Helper to extract editable ranges
const getEditableRanges = (code) => {
  const lines = code.split('\n');
  const ranges = [];
  let start = -1;
  const startMarker = /Write your code here/;
  const endMarker = /End of editable area/;

  lines.forEach((line, i) => {
    if (startMarker.test(line)) start = i + 1;
    else if (start !== -1 && endMarker.test(line)) {
      if (i - 1 >= start) ranges.push(new Range(start, 0, i - 1, Infinity));
      start = -1;
    }
  });
  if (start !== -1) ranges.push(new Range(start, 0, lines.length, Infinity));
  return ranges;
};

const CodeEditorSection = ({ problem, mycode, setTestCode }) => {


  const { theme, language, fontSize, setFontSize } = useSettings();
  const [code, setCode] = useState('');
  const {myCode, setMyCode} = useCode();
  const [editableRanges, setEditableRanges] = useState([]);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisError, setAnalysisError] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [submissionError, setSubmissionError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {isDisqualified,handlePasteEvent} = useProctoring();
  const {user} = useUser();
  const location = useLocation();

  const aceEditorRef = useRef(null);

  const languageMap = {
    javascript: ['javascript', 93],
    python: ['python', 92],
    java: ['java', 91],
    cpp: ['c_cpp', 54],
  };

  // Load code from localStorage or starter
  useEffect(() => {
    const key = `code-${problem?.id}-${language}`;
    const savedCode = localStorage.getItem(key);
    if (savedCode) {
      setCode(savedCode);
      setEditableRanges(getEditableRanges(savedCode));
    } else if (problem?.starterCode?.[language]) {
      const starterCode = problem.starterCode[language];
      setCode(starterCode);
      setEditableRanges(getEditableRanges(starterCode));
      localStorage.setItem(key, starterCode);
    }
  }, [problem, language]);

  // Save code changes to localStorage
  const handleTestCode = (newCode) => {
    setCode(()=>newCode);
    setMyCode(newCode);
    if (problem?.id) {
      localStorage.setItem(`code-${problem.id}-${language}`, newCode);
    }
  };

 
  const handleResetCode = () => {
    if (problem?.starterCode?.[language]) {
      const starterCode = problem.starterCode[language];
      setCode(starterCode);
      setTestCode(starterCode);
      setEditableRanges(getEditableRanges(starterCode));
      localStorage.setItem(`code-${problem.id}-${language}`, starterCode);
    }
  };

  const throttledRunAnalysis = useCallback(throttle(async () => {
    if (!problem?.testCases?.length) {
      setAnalysisError("No test cases available to analyze this problem.");
      return;
    }
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setAnalysisError(null);
    const firstTestCaseInput = String(problem.testCases[0].input);
    try {
      const result = await analyzeCodeWithGemini(code, language, firstTestCaseInput);
      if (result.error && !result.output) setAnalysisError(result.error);
      else setAnalysisResult(result);
    } catch (err) {
      setAnalysisError(err.message || 'An unexpected error occurred during analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  }, 5000, { trailing: false }), [code, language, problem]);

  const onBeforeChange = (delta) => {
    if (editableRanges.length === 0) return;
    const { start, end } = delta;
    const isChangeAllowed = editableRanges.some(range =>
      range.contains(start.row, start.column) && range.contains(end.row, end.column)
    );
    if (!isChangeAllowed) return null;
  };

  const handleSubmitSolution = async () => {
    if (!problem?.id) {
      setSubmissionError("Problem data is not loaded. Cannot submit.");
      setIsModalOpen(true);
      return;
    }
    const contestId = new URLSearchParams(location.search).get('contestId');
    setIsModalOpen(true);
    setIsSubmitting(true);
    setSubmissionResult(null);
    setSubmissionError(null);

    try {
      const result = await evaluateSolution(problem, code, language);
      setSubmissionResult(result);

      if (result.verdict === 'EVALUATION_FAILED') {
        setSubmissionError(result.error);
        return;
      }

      const isAccepted = result.verdict === 'ACCEPTED';

      await updateProblemStatus(
        problem.id,
        user.id,
        code,
        language,
        isAccepted,
        result.avgMemory, // Use result directly
        result.avgRuntime, // Use result directly
        contestId
      );

      if (isAccepted) {
        localStorage.removeItem(`code-${problem.id}-${language}`);
      }

    } catch (err) {
      console.error("Submission process failed:", err);
      setSubmissionError(err.message || 'An unexpected error occurred during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SubmissionResultModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isLoading={isSubmitting}
        result={submissionResult}
        error={submissionError}
      />

      <div className="h-full w-full overflow-hidden">
        <div className="h-full rounded-lg bg-background/90 border-border border backdrop-blur flex flex-col">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <h2 className="text-foreground text-sm font-medium">Code Editor</h2>
                  <p className="text-muted-foreground text-xs">Analyze or submit your solution</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-muted ring-border flex items-center gap-3 rounded-lg px-3 py-2 ring-1">
                  <CaseSensitive className="text-muted-foreground size-4" />
                  <input
                    type="range"
                    min="12"
                    max="24"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
                    className="bg-secondary h-1 w-20 cursor-pointer rounded-lg"
                  />
                  <span className="text-muted-foreground min-w-[2rem] text-center text-sm font-medium">{fontSize}</span>
                </div>
                <button onClick={handleResetCode} className="bg-muted ring-border hover:bg-accent cursor-pointer rounded-lg p-2 ring-1 transition-colors" aria-label="Reset code">
                  <RefreshCcw className="text-muted-foreground size-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="group ring-border relative rounded-lg ring-1 mx-6 mb-4  flex-col min-h-[400px]">
            <AceEditor
              mode={languageMap[language][0] || 'javascript'}
              theme={theme}
              onChange={handleTestCode}
              onPaste={(pastedText) => {
                if (handlePasteEvent) {
                  handlePasteEvent(pastedText);
                }
                // Note: The default paste action will proceed.
              }}
              name="CODE_EDITOR_INSTANCE"
              value={code}
              fontSize={fontSize}
              width="100%" height="100%"
              className="!rounded-lg"
              showPrintMargin={false}
              editorProps={{ $blockScrolling: true }}
              setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true
              }}
              commands={[{
                name: "preventWriteInReadOnly",
                exec: onBeforeChange,
                readOnly: false
              }]}
            />
          </div>

          <div className="bg-muted/50 border-t p-4 ">
            <AnalysisOutput result={analysisResult} error={analysisError} isLoading={isAnalyzing} />
            <div className="flex items-center justify-end gap-3 ">
              <button
                onClick={throttledRunAnalysis}
                disabled={isAnalyzing || isSubmitting || isDisqualified}
            
                className="cursor-pointer justify-center whitespace-nowrap rounded-md font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-wait bg-gradient-to-b from-indigo-400 to-indigo-600 text-sm text-white/90 transition duration-300 ease-in-out hover:from-indigo-400/70 hover:to-indigo-600/70 h-10 px-4 py-2 flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                {isAnalyzing ? "Analyzing..." : "Run Analysis"}
              </button>
              <button
                onClick={handleSubmitSolution}
                disabled={isSubmitting || isAnalyzing || isDisqualified}
                className="cursor-pointer justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-wait text-primary-foreground h-10 px-4 py-2 flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? "Submitting..." : "Submit Solution"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CodeEditorSection;