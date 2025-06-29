import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';
import { RefreshCcw, CaseSensitive } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

// --- START: Ace Editor Imports & Configuration ---
import ace from 'ace-builds/src-noconflict/ace';
// Import Modes
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-c_cpp';
// Import Themes
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-solarized_light';
import 'ace-builds/src-noconflict/theme-dracula';
// Import Language Tools
import 'ace-builds/src-noconflict/ext-language_tools';

ace.config.set("basePath", "https://cdn.jsdelivr.net/npm/ace-builds@1.33.0/src-noconflict/");
// --- END: Ace Editor Imports & Configuration ---

const CodeEditorSection = ({ problem }) => {
  const { theme, language, fontSize, setFontSize } = useSettings();
  const [code, setCode] = useState('');

  // Effect to update code when problem or language changes
  useEffect(() => {
    if (problem && problem.starterCode && problem.starterCode[language]) {
      setCode(problem.starterCode[language]);
    }
  }, [problem, language]);

  const handleRunCode = () => {
    console.log("Running code...");
    alert("Running code! (Note: Real execution requires a backend service)");
  };
  
  const handleSubmitSolution = () => {
    console.log("Submitting solution...");
    alert("Solution Submitted! (Note: Real submission requires a backend service)");
  };
  
  const handleResetCode = () => {
    if (problem && problem.starterCode && problem.starterCode[language]) {
      setCode(problem.starterCode[language]);
      alert("Code has been reset to the template.");
    }
  };

  const languageToMode = {
    javascript: 'javascript',
    python: 'python',
    java: 'java',
    cpp: 'c_cpp'
  };

  return (
    <div className="bg-dark-panel h-full rounded-lg flex flex-col">
      {/* Editor Header */}
      <div className="flex justify-between items-center p-3 border-b border-dark-border">
        <h3 className="text-text-primary text-sm font-semibold">Code Editor</h3>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <CaseSensitive className="w-5 h-5 text-text-secondary" />
            <input 
              type="range" 
              min="12" 
              max="24" 
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
              className="w-20"
            />
            <span className="text-text-secondary text-sm">{fontSize}px</span>
          </div>
          <button onClick={handleResetCode} className="text-text-secondary hover:text-text-primary">
            <RefreshCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Ace Editor */}
      <div className="flex-grow">
        <AceEditor
          mode={languageToMode[language] || 'javascript'}
          theme={theme}
          onChange={setCode}
          name="CODE_EDITOR"
          value={code}
          fontSize={fontSize}
          width="100%"
          height="100%"
          showPrintMargin={false}
          editorProps={{ $blockScrolling: true }}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            showLineNumbers: true,
            tabSize: language === 'python' ? 4 : 2,
          }}
        />
      </div>

      {/* Footer with buttons */}
      <div className="flex justify-end items-center p-3 border-t border-dark-border space-x-4">
        <button 
          onClick={handleRunCode}
          className="bg-dark-panel hover:bg-dark-hover text-text-primary font-semibold py-2 px-6 rounded-md transition-colors border border-dark-border"
        >
          Run Code
        </button>
        <button 
          onClick={handleSubmitSolution}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-md transition-colors"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default CodeEditorSection;