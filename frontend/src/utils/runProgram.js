// src/utils/judge0.js
import axios from "axios";


// A helper function to sleep for a given time
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Executes code using the Judge0 API with proper polling.
 * @param {string} sourceCode - The user's source code.
 * @param {string} language - The language name (e.g., 'python', 'java').
 * @param {string} stdin - The standard input to run against the code.
 * @returns {Promise<object>} The final submission result from Judge0.
 */
const handleRun = async (sourceCode, language_id, stdin) => {
  const languageId = language_id;
  if (!languageId) {
    throw new Error(`Language '${language}' is not supported.`);
  }

  // --- Step 1: Create the submission ---
  const createOptions = {
    method: 'POST',
    url: 'https://judge0-ce.p.rapidapi.com/submissions',
    params: { base64_encoded: 'false', fields: '*' },
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': import.meta.env.VITE_RAPID_API_KEY,
      'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
    },
    data: {
      source_code: sourceCode,
      language_id: languageId,
      stdin: stdin,
    }
  };

  const createResponse = await axios.request(createOptions);
  const token = createResponse.data.token;

  // --- Step 2: Poll for the result ---
  let result;
  while (true) {
    const getOptions = {
      method: 'GET',
      url: `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
      params: { base64_encoded: 'false', fields: '*' },
      headers: {
        'X-RapidAPI-Key': import.meta.env.VITE_RAPID_API_KEY,
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
      }
    };
    
    const getResponse = await axios.request(getOptions);
    const statusId = getResponse.data.status.id;

    // Status IDs 1 (In Queue) and 2 (Processing) mean we need to wait.
    if (statusId === 1 || statusId === 2) {
      await sleep(2000); // Wait 2 seconds before checking again
    } else {
      // Any other status is a final result (Accepted, Wrong Answer, Error, etc.)
      result = getResponse.data;
      break;
    }
  }

  return result;
};

export default handleRun;