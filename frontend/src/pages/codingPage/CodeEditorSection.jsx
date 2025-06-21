// src/components/CodeEditorSection.jsx
import React, { useState } from 'react';
import AceEditor from 'react-ace';
import { RefreshCcw, CaseSensitive } from 'lucide-react';

// --- START: Ace Editor Imports & Configuration ---
import ace from 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools'; // Import language tools

// Configure the base path for Ace to find its worker and theme files
// Using a CDN is the most straightforward way to fix this.
ace.config.set(
  "basePath",
  "https://cdn.jsdelivr.net/npm/ace-builds@1.33.0/src-noconflict/"
);
// --- END: Ace Editor Imports & Configuration ---

const initialCode = `
const readline = require('readline');

function checkEvenOdd(n) {
  // Write your code here
  // Return 'Even' or 'Odd'
  if (n % 2 === 0) {
    return 'Even';
  } else {
    return 'Odd';
  }
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (line) => {
    const n = parseInt(line, 10);
    console.log(checkEvenOdd(n));
    rl.close();
});`;

const CodeEditorSection = () => {
  const [code, setCode] = useState(initialCode);
  const [fontSize, setFontSize] = useState(14);

  const handleRunCode = () => {
    console.log("Running code...");
    alert("Running code! (Note: Real execution requires a backend service)");
  };
  
  const handleSubmitSolution = () => {
    console.log("Submitting solution...");
    alert("Solution Submitted! (Note: Real submission requires a backend service)");
  };
  
  const handleResetCode = () => {
    setCode(initialCode);
    alert("Code has been reset to the default template.");
  };

  return (
    <div className="bg-dark-panel h-full rounded-lg flex flex-col">
      {/* Editor Header */}
      <div className="flex justify-between items-center p-3 border-b border-dark-border">
        <div className='flex items-center'>
            <span className='bg-yellow-400 text-black text-xs font-bold rounded-sm px-1 mr-2'>JS</span>
            <h3 className="text-text-primary text-sm font-semibold">Code Editor</h3>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <CaseSensitive className="w-5 h-5 text-text-secondary" />
            <input 
              type="range" 
              min="12" 
              max="20" 
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              className="w-20"
            />
            <span className="text-text-secondary text-sm">{fontSize}</span>
          </div>
          <button onClick={handleResetCode} className="text-text-secondary hover:text-text-primary">
            <RefreshCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Ace Editor */}
      <div className="flex-grow ">
        <AceEditor
          mode="javascript"
          theme="monokai"
          onChange={setCode}
          name="CODE_EDITOR"
          value={code}
          fontSize={fontSize}
          width="100%"
          height="100%"
          showPrintMargin={false}
          editorProps={{ $blockScrolling: true }}
          setOptions={{
            // These options will now be recognized correctly
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            showLineNumbers: true,
            tabSize: 2,
          }}
        />
      </div>

      {/* Footer with buttons */}
      <div className="flex justify-between items-center p-3 border-t border-dark-border space-x-4">
        <button 
          onClick={handleRunCode}
          className="bg-orange-400 hover:bg-primary-hover cursor-pointer text-white font-semibold py-2 px-6 rounded-md transition-colors"
        >
          Run Code
        </button>
        <button 
          onClick={handleSubmitSolution}
          className="bg-green-500 hover:bg-secondary-hover cursor-pointer text-white font-semibold py-2 px-6 rounded-md transition-colors"
        >
          Submit Solution
        </button>
      </div>
    </div>
  );
};

export default CodeEditorSection;