import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/clerk-react';
import { FiLink, FiCopy, FiPlay, FiUsers } from 'react-icons/fi';
import { FaCrown } from 'react-icons/fa';

const ContestLobby = () => {
    const { contestId } = useParams();
    const navigate = useNavigate();
    const { getToken } = useAuth();
    const { user } = useUser();

    const [contest, setContest] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const inviteLink = `${window.location.origin}/contest/${contestId}`;

    const fetchContestData = useCallback(async () => {
        try {
            const token = await getToken();
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/contests/${contestId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to fetch contest data');
            setContest(data);

            if (data.status === 'live') {
                const endTime = new Date(data.startTime).getTime();
                const now = new Date().getTime();
                setTimeLeft(Math.max(0, Math.floor((endTime - now) / 1000)));
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [contestId, getToken]);

    useEffect(() => {
        fetchContestData();
        const interval = setInterval(() => {
            if (document.visibilityState === 'visible') {
                fetchContestData();
            }
        }, 5000); 
        return () => clearInterval(interval);
    }, [fetchContestData]);

    useEffect(() => {
        if (timeLeft <= 0 || contest?.status !== 'live') return;
        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft, contest?.status]);

    const handleStartContest = async () => {
        try {
            const token = await getToken();
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/contests/start/${contestId}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to start');
            setContest(data);
        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };
    
    const handleCopy = () => {
        navigator.clipboard.writeText(inviteLink).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };
    
    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    if (loading) return <div className="text-center mt-20">Loading Lobby...</div>;
    if (error) return <div className="text-center mt-20 text-red-500">Error: {error}</div>;
    if (!contest) return <div className="text-center mt-20">Contest not found.</div>;

    const isHost = user?.id === contest.hostId;

    return (
        <div className="h-full w-[90%] m-auto mt-20 sm:p-6 lg:p-8 font-sans">
            <div className="max-w-screen-lg mx-auto">
                <Link to="/contest" className="text-sm text-purple-600 hover:underline mb-4 inline-block">← Back to Competitions</Link>
                <div className="bg-white rounded-xl shadow-sm border p-8">
                    <div className="text-center">
                        <p className="text-gray-500">{contest.status === 'live' ? 'Time Remaining' : 'Contest Starts When Host Decides'}</p>
                        <h1 className="text-7xl font-bold text-gray-900 my-4">
                            {contest.status === 'live' ? formatTime(timeLeft) : 'Lobby'}
                        </h1>
                        <h2 className="text-3xl font-bold text-gray-800">{contest.name}</h2>
                        <p className="text-gray-500 mt-1">Contest ID: {contest.contestId}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                        <div className="md:col-span-1 bg-gray-50 rounded-lg p-6">
                            <h3 className="font-bold text-lg flex items-center gap-2"><FiLink/> Invite Friends</h3>
                            <div className="mt-4 flex">
                                <input type="text" readOnly value={inviteLink} className="w-full bg-white border border-gray-300 rounded-l-lg px-3 text-sm"/>
                                <button onClick={handleCopy} className="px-3 py-2 bg-purple-600 text-white rounded-r-lg hover:bg-purple-700 transition">
                                    {copied ? 'Copied!' : <FiCopy/>}
                                </button>
                            </div>
                        </div>

                        <div className="md:col-span-2 bg-gray-50 rounded-lg p-6">
                            {/* **FIX 1: Safely access the participants array length.** */}
                            <h3 className="font-bold text-lg flex items-center gap-2"><FiUsers/> Participants ({(contest?.participants || []).length})</h3>
                            <ul className="mt-4 space-y-3">
                                {/* **FIX 2: Safely map over the participants array.** */}
                                {(contest?.participants || []).map(p => (
                                    <li key={p.userId} className="flex items-center justify-between text-gray-700">
                                        <span>{p.displayName}{p.userId === user.id && ' (You)'}</span>
                                        {p.userId === contest.hostId && <FaCrown className="text-yellow-500" title="Host"/>}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                 <div className="mt-6 flex justify-center">
                    {contest.status === 'upcoming' && isHost && (
                        <button onClick={handleStartContest} className="px-10 py-4 bg-green-600 text-white text-lg rounded-lg font-bold flex items-center gap-3 hover:bg-green-700 transition">
                            <FiPlay/> Start Contest Now
                        </button>
                    )}
                    {/* **FIX 3: Ensure problems array exists before accessing its first element.** */}
                    {contest.status === 'live' && (
                        <button onClick={() => navigate(`/problems/${contest.problems[0]?.id}?contestId=${contest.contestId}`)} disabled={!contest.problems || contest.problems.length === 0} className="px-10 py-4 bg-blue-600 text-white text-lg rounded-lg font-bold flex items-center gap-3 hover:bg-blue-700 transition disabled:opacity-50">
                            Enter Contest
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContestLobby;