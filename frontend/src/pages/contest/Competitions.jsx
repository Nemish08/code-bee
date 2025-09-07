import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { FiPlus, FiChevronRight,FiUsers,FiClock } from 'react-icons/fi';


const PastContestCard = ({ contest }) => (
    <Link to={`/contest/results/${contest.contestId}`} className="block bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
        <div className="flex justify-between items-center">
            <div>
                <h4 className="font-bold text-lg">{contest.name}</h4>
                <p className="text-sm text-gray-500">
                    {new Date(contest.createdAt).toLocaleDateString()} • 
                    {contest.status === 'finished' ? 'Completed' : contest.status}
                </p>
            </div>
            <FiChevronRight className="text-gray-400"/>
        </div>
        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
            <div className="flex items-center gap-1">
                <FiUsers size={14} />
                <span>{contest.participants?.length || 0} participants</span>
            </div>
            <div className="flex items-center gap-1">
                <FiClock size={14} />
                <span>{contest.duration} mins</span>
            </div>
        </div>
    </Link>
);

const Competitions = () => {
  const [isJoinModalOpen, setJoinModalOpen] = useState(false);
  const [finishedContests, setFinishedContests] = useState([]);
  const [contestHistory, setContestHistory] = useState([]);
  const navigate = useNavigate();
  const { getToken } = useAuth();

  useEffect(() => {
      const fetchFinished = async () => {
          try {
              const token = await getToken();
              const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/contests/finished`, {
                  headers: { 'Authorization': `Bearer ${token}` }
              });
              if (!res.ok) throw new Error('Failed to fetch past contests');
              const data = await res.json();
              setFinishedContests(data);
          } catch(err) { 
              console.error(err);
          }
      };

      const fetchContestHistory = async () => {
          try {
              const token = await getToken();
              const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/contests/history`, {
                  headers: { 'Authorization': `Bearer ${token}` }
              });
              if (res.ok) {
                  const data = await res.json();
                  setContestHistory(data);
              }
          } catch(err) {
              console.error('Failed to fetch contest history', err);
          }
      };

      if (getToken) {
        fetchFinished();
        fetchContestHistory();
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
        {/* Header section */}
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
        
        {/* Contest History */}
        <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800">Your Contest History</h2>
            <div className="mt-4 space-y-4">
                {contestHistory.length > 0 ? (
                    contestHistory.map(c => <PastContestCard key={c._id} contest={c} />)
                ) : (
                    <div className="text-center text-gray-500 bg-gray-50 p-8 rounded-lg">
                        <p>You haven't participated in any contests yet.</p>
                    </div>
                )}
            </div>
        </div>

        {/* Past Competitions */}
        <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800">Past Competitions</h2>
            <div className="mt-4 space-y-4">
                {finishedContests.length > 0 ? (
                    finishedContests.map(c => <PastContestCard key={c._id} contest={c} />)
                ) : (
                    <div className="text-center text-gray-500 bg-gray-50 p-8 rounded-lg">
                        <p>No completed contests found.</p>
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* Join Contest Modal */}
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