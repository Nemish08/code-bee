// pages/codingPage/ContestSidebar.jsx

import React, { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { Link, useParams } from 'react-router-dom';
import { FaTrophy, FaCheckCircle, FaClipboardList } from 'react-icons/fa';

// FIX: Added 'isOpen' prop to control visibility of content
const ContestSidebar = ({ contest, problems, isOpen }) => {
    const { problemId } = useParams();
    const { user } = useUser();
    const { getToken } = useAuth();
    const [leaderboard, setLeaderboard] = useState([]);
    const [userProgress, setUserProgress] = useState([]);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            if (!contest?.contestId) return;
            try {
                const token = await getToken();
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/contests/${contest.contestId}/leaderboard`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!res.ok) return;
                const data = await res.json();
                setLeaderboard(data);

                const currentUserData = data.find(p => p.userId === user.id);
                if (currentUserData) {
                    // Assuming problemsSolved is an array of objects with a problemId property
                    setUserProgress(currentUserData.problemsSolved.map(p => p.problemId.toString()));
                }
            } catch (error) {
                console.error("Failed to fetch leaderboard", error);
            }
        };

        fetchLeaderboard();
        const interval = setInterval(fetchLeaderboard, 10000);
        return () => clearInterval(interval);

    }, [contest?.contestId, getToken, user?.id]);

    return (
        <div className="bg-dark-panel h-full rounded-lg flex flex-col p-4 text-white overflow-hidden">
            {/* FIX: Render content only when the sidebar is open */}
            {isOpen && (
                <>
                    {/* FIX: Added the contest title */}
                    <h2 className="text-xl font-bold mb-4 border-b border-dark-border pb-2 flex items-center gap-2 truncate">
                        <FaClipboardList /> {contest?.name}
                    </h2>

                    <h3 className="font-semibold mb-2">Contest Problems</h3>
                    <ul className="space-y-2 mb-6">
                        {problems.map(p => (
                            <Link to={`/problems/${p.id}?contestId=${contest.contestId}`} key={p._id}>
                                <li className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${problemId === p.id ? 'bg-primary/30' : 'hover:bg-dark-layer-2'}`}>
                                    <span className="truncate">{p.title}</span>
                                    {/* Make sure to compare ObjectIDs as strings if necessary */}
                                    {userProgress.includes(p._id.toString()) && <FaCheckCircle className="text-green-500 flex-shrink-0" />}
                                </li>
                            </Link>
                        ))}
                    </ul>

                    <h3 className="text-lg font-bold mb-4 border-b border-dark-border pb-2 flex items-center gap-2"><FaTrophy /> Leaderboard</h3>
                    <ul className="space-y-3 overflow-y-auto flex-grow">
                        {leaderboard.map((p, index) => (
                            <li key={p.userId} className={`flex justify-between p-2 rounded-lg ${p.userId === user.id ? 'bg-yellow-500/20' : ''}`}>
                                <span className="font-semibold truncate">{index + 1}. {p.displayName}</span>
                                <span className="font-bold flex-shrink-0">{p.score} pts</span>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default ContestSidebar;