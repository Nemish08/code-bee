import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini AI model
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

/**
 * Analyzes user code using the Gemini API.
 * @param {string} code The user's source code.
 * @param {string} language The programming language (e.g., 'javascript', 'python').
 * @param {string} sampleInput The sample input to test the code against.
 * @returns {Promise<object>} A promise that resolves to a structured analysis object.
 */
const analyzeCodeWithGemini = async (code, language, sampleInput) => {
    console.log(code, language, sampleInput)
  // We engineer the prompt to request a specific JSON structure. This is key for reliability.
  const prompt = `
    Analyze the following ${language} code.

    Code:
    \`\`\`${language}
    ${code}
    \`\`\`

    1.  Use the following as the standard input for the code:
        \`\`\`
        ${sampleInput}
        \`\`\`

    2.  Determine the exact output produced by the code with the given input.
    3.  Analyze its time complexity (Big O notation).
    4.  Analyze its space complexity (Big O notation).
    5.  If there's a syntax or runtime error, describe it clearly. If the code is correct but has logical flaws or inefficiencies, point them out in the error field. If there are no errors, the error field should be null.

    if there is error in code remember never complete the code, just give the sggeustion to fix the error , never ever give the complete code.
    Provide the response strictly in the following JSON format. Do not include any other text or markdown formatting outside of the JSON object.

    {
      "input": "the provided sample input",
      "output": "the code's output, or an empty string if no output",
      "timeComplexity": "e.g., O(n)",
      "spaceComplexity": "e.g., O(1)",
      "error": "description of the error or null if none exists"
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean the response text to ensure it's a valid JSON string
    const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();

    // Parse the JSON string into an object
    return JSON.parse(jsonString);

  } catch (error) {
    console.error("Gemini API Error:", error);
    // Return a structured error object that our UI can handle
    return {
      input: sampleInput,
      output: null,
      timeComplexity: "N/A",
      spaceComplexity: "N/A",
      error: `Failed to get analysis from AI. ${error.message || 'Please check your API key and network connection.'}`,
    };
  }
};

export default analyzeCodeWithGemini;