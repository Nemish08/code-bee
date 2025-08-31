import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { FiPlus, FiChevronRight } from 'react-icons/fi';

// This is a reusable component to display a link to a finished contest's results page.
const PastContestCard = ({ contest }) => (
    <Link to={`/contest/results/${contest.contestId}`} className="block bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
        <div className="flex justify-between items-center">
            <div>
                <h4 className="font-bold text-lg">{contest.name}</h4>
                <p className="text-sm text-gray-500">Completed on {new Date(contest.updatedAt).toLocaleDateString()}</p>
            </div>
            <FiChevronRight className="text-gray-400"/>
        </div>
    </Link>
);


const Competitions = () => {
  const [isJoinModalOpen, setJoinModalOpen] = useState(false);
  const [finishedContests, setFinishedContests] = useState([]);
  const navigate = useNavigate();
  const { getToken } = useAuth();

  // useEffect hook to fetch the user's finished contests from the backend when the component loads.
  useEffect(() => {
      const fetchFinished = async () => {
          try {
              const token = await getToken();
              const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/contests/finished`, {
                  headers: { 'Authorization': `Bearer ${token}` }
              });
              if (!res.ok) {
                  throw new Error('Failed to fetch past contests');
              }
              const data = await res.json();
              setFinishedContests(data);
          } catch(err) { 
              console.error(err);
              // Optionally set an error state here to show in the UI
          }
      };
      // Fetch data only if the getToken function is available.
      if (getToken) {
        fetchFinished();
      }
  }, [getToken]);

  // Handles the submission of the "Join Contest" modal form.
  const handleJoinContest = async (e) => {
    e.preventDefault();
    const contestCode = e.target.elements.contestCode.value;
    if (!contestCode) return;

    try {
        const token = await getToken();
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/contests/join/${contestCode}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to join contest.");
        }
        navigate(`/contest/${contestCode}`);
    } catch(err) {
        alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="h-full w-[80%] m-auto mt-20 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-screen-xl mx-auto">
        {/* Header section with page title and action buttons */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Competitions</h1>
            <p className="text-lg text-gray-500 mt-2">Create a private contest or join with a code.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setJoinModalOpen(true)} className="px-4 py-2 bg-white border border-gray-300 rounded-lg font-semibold hover:bg-gray-100 transition">
              Join Contest
            </button>
            <Link to="/create-contest" className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold flex items-center gap-2 hover:bg-green-500/80 transition">
              <FiPlus /> Create Contest
            </Link>
          </div>
        </div>
        
        {/* UPDATED SECTION: Dynamically displays past contests */}
        <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800">Past Competitions</h2>
            <div className="mt-4 space-y-4">
                {finishedContests.length > 0 ? (
                    // If there are finished contests, map over them and render a card for each.
                    finishedContests.map(c => <PastContestCard key={c._id} contest={c} />)
                ) : (
                    // If the array is empty, show a placeholder message.
                    <div className="text-center text-gray-500 bg-gray-50 p-8 rounded-lg">
                        <p>You have not completed any contests yet.</p>
                        <p className="text-sm mt-2">Your past contest results will appear here.</p>
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* Join Contest Modal - remains unchanged */}
      {isJoinModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={() => setJoinModalOpen(false)}>
          <div className="bg-white rounded-xl p-8 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-bold">Join a Private Contest</h2>
            <p className="text-gray-500 mt-1">Enter the invite code you received from the host.</p>
            <form className="mt-6" onSubmit={handleJoinContest}>
              <input
                type="text"
                name="contestCode"
                placeholder="e.g., XYZ123AB"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              />
              <button type="submit" className="w-full mt-4 px-4 py-3 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700 transition">
                Join Contest
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Competitions;