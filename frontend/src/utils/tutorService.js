

/**
 * Fetches the conversation history for a specific problem.
 * @param {string} problemStringId The string ID of the problem (e.g., "two-sum").
 * @returns {Promise<Array>} A promise that resolves to an array of message objects.
 */
export const fetchConversation = async (problemStringId ,id) => {
    // Assuming a real auth system where a token is stored
   
  
    // The URL now uses the human-readable string ID.
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/tutor/fetch/${problemStringId}`, {
        headers: {
            'Content-Type': 'application/json',
            
        },
        body: JSON.stringify({ id }),     
        method: 'POST'
    });
  
    if (!response.ok) {
      console.error("Failed to fetch chat history:", response.statusText);
      throw new Error('Failed to fetch chat history.');
    }
    return response.json();
  };
  
 
  export const sendMessageToTutor = async (problemStringId, message,id,problem) => {
  
  
    // The URL now uses the human-readable string ID.
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/tutor/send/${problemStringId}`, {
        headers: {
            'Content-Type': 'application/json',
            
          },
      method: 'POST',
      body: JSON.stringify({
        id,
        message,
        problem
      })
    });
    
    console.log(response)
    if (!response.ok) {
      console.error("Failed to send message:", response.statusText);
      throw new Error('Failed to send message.');
    }
    return response.json();
  };