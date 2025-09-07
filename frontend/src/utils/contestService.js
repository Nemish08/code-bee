import { useAuth } from '@clerk/clerk-react';

export const useContestService = () => {
  const { getToken } = useAuth();

  const submitContest = async (contestId) => {
    try {
      const token = await getToken();
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/contests/${contestId}/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit contest');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error submitting contest:', error);
      throw error;
    }
  };

  const getContestHistory = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/contests/history`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch contest history');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching contest history:', error);
      throw error;
    }
  };

  return {
    submitContest,
    getContestHistory
  };
};