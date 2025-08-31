import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
// For complex analysis, 'gemini-1.5-pro-latest' is more robust, but 'flash' is faster.
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

/**
 * Uses Gemini to generate test cases for a problem, evaluate user code against them,
 * and return a detailed report.
 *
 * @param {object} problem - The problem object, containing title and description.
 * @param {string} code - The user's submitted code.
 * @param {string} language - The programming language.
 * @returns {Promise<object>} A promise that resolves to a structured evaluation object.
 */
const evaluateSolution = async (problem, code, language) => {
  // This prompt is the "magic." It instructs the AI to act as a complete code judge.
  const prompt = `
    You are an expert Code Judge AI. Your task is to evaluate a user's code submission for a given programming problem.

    **Problem Details:**
    - **Title:** ${problem.title}
    - **Description:** ${problem.description}

    **User's Submission:**
    - **Language:** ${language}
    - **Code:**
    \`\`\`${language}
    ${code}
    \`\`\`

    **Your Evaluation Steps:**
    1.  **Generate Test Cases:** Based on the problem description, create 5 diverse test cases. Include edge cases (e.g., empty inputs, large inputs, specific constraints mentioned in the description). Each test case must have an 'input' and an 'expectedOutput'.
    2.  **Execute and Compare:** For each of the 5 test cases you generated, simulate the execution of the user's code with the test case's input.
    3.  **Record Results:** For each test case, record the user's actual output and determine if it matches the expected output.
    4.  **Final Verdict:**
        - If the code has a syntax or runtime error, the overall verdict is 'RUNTIME_ERROR'.
        - If all 5 test cases pass, the verdict is 'ACCEPTED'.
        - Otherwise, the verdict is 'WRONG_ANSWER'.
    5.  **Performance Estimation:** Provide a rough, high-level estimation of the average runtime and memory usage for the successful test cases. This is an estimation, not a precise measurement.

    **Output Format:**
    You MUST provide the response strictly in the following JSON format. Do not include any other text, explanations, or markdown formatting outside of the single JSON object.

    {
      "verdict": "ACCEPTED | WRONG_ANSWER | RUNTIME_ERROR",
      "successRate": "e.g., 40.0%",
      "avgRuntime": "e.g., 0.015 s",
      "avgMemory": "e.g., 4128 KB",
      "testCases": [
        {
          "id": 1,
          "input": "...",
          "expectedOutput": "...",
          "actualOutput": "...",
          "passed": true | false
        },
        {
          "id": 2,
          "input": "...",
          "expectedOutput": "...",
          "actualOutput": "...",
          "passed": true | false
        }
      ]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(jsonString);

  } catch (error) {
    console.error("Gemini Evaluation Error:", error);
    return {
      verdict: 'EVALUATION_FAILED',
      error: `The AI failed to evaluate the solution. ${error.message || 'Please try again.'}`
    };
  }
};

export default evaluateSolution;