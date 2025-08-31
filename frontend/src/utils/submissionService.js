
export const fetchSubmissionsByProblemId = async (problemId, userId) => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/api/attempts/${problemId}`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Pass the user's auth token to the protected backend route
         
        },
        body: JSON.stringify({ userId }),
      });
  
      if (!response.ok) {
        // Throw an error with a meaningful message to be caught by the component
        throw new Error(`Failed to fetch submissions. Status: ${response.status}`);
      }
  
      const submissions = await response.json();
    
      return submissions;
  
    } catch (error) {
      console.error("Error in fetchSubmissionsByProblemId:", error);
      // Re-throw the error so the calling component knows the request failed
      throw error;
    }
  };