// Add contestId as a parameter
export const updateProblemStatus = async (problemId, userId, code, language, isSolved, memory, runtime, contestId = null) => {
   
  if(!memory) memory = "0";
  if(!runtime) runtime = "0";
  const status = isSolved;
  try {
    const body = { problemId, userId, code, language, isSolved, memory, runtime, status, contestId };

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/attempts/submit`, { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body), 
    });

    if (!response.ok) {
      throw new Error(`Backend API failed with status ${response.status}`);
    }
    console.log('Backend update successful');
  
  } catch (error) {
    console.warn('Failed to update problem status on backend:', error.message);
  }
};