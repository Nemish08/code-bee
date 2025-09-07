import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/clerk-react';
import { FaTrophy, FaCrown, FaShieldAlt, FaSpinner } from 'react-icons/fa';

const ContestResultsPage = () => {
    const { contestId } = useParams();
    const { getToken } = useAuth();
    const { user } = useUser();
    const [contest, setContest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const fetchResults = async () => {
        try {
            const token = await getToken();
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/contests/${contestId}`, {
                headers: { 'Authorization': `Bearer ${token}` }           });
            const data = await res.json();
            setContest(data);
        } catch (error) {
            console.error("Failed to fetch results", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResults();
    }, [contestId, getToken]);

    const handleAnalyzePlagiarism = async () => {
        setIsAnalyzing(true);
        try {
            const token = await getToken();
            await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/contests/${contestId}/analyze-plagiarism`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` } });
            // Re-fetch data to get the report
            await fetchResults();
        } catch (error) {
            console.error("Failed to start plagiarism analysis", error);
            alert("An error occurred while starting the analysis.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    if (loading) return <div className="text-center mt-20">Loading Results...</div>;
    if (!contest) return <div className="text-center mt-20">Could not load contest results.</div>;
    
    const sortedLeaderboard = [...contest.participants].sort((a,b) => b.score - a.score);
    const isHost = user?.id === contest.hostId;

    return (
        <div className="h-full w-[90%] m-auto mt-20 sm:p-6 lg:p-8 font-sans">
            <div className="max-w-screen-lg mx-auto"> <Link to="/contest" className="text-sm text-purple-600 hover:underline mb-4 inline-block">Back to Competitions</Link>
                <div className="bg-white rounded-xl shadow-sm border p-8">
                    <div className="text-center"> <FaTrophy className="text-7xl text-yellow-400 mx-auto" />
                        <h1 className="text-4xl font-bold text-gray-900 mt-4">{contest.name}</h1>
                        <p className="text-gray-500">Results</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                        <div>
                            <h3 className="font-bold text-lg">Final Leaderboard</h3>
                            <ul className="mt-4 space-y-3 bg-gray-50 p-4 rounded-lg">                             {sortedLeaderboard.map((p, index) => (<li key={p.userId} className="flex items-center justify-between text-gray-700">                                       <span className="font-semibold">{index + 1}. {p.displayName} {p.userId === contest.hostId && <FaCrown className="inline text-yellow-500" />}</span>
                                        <span>{p.score} pts</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Problems in this Contest</h3>
                            <ul className="mt-4 space-y-2 bg-gray-50 p-4 rounded-lg">{contest.problems.map(prob => <li key={prob._id}>{prob.title}</li>)}
                            </ul>
                        </div>
                    </div>

                    {/* --- Plagiarism Report Section --- */}
                    {/* <div className="mt-12 border-t pt-8">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-lg flex items-center gap-2"><FaShieldAlt className="text-blue-500"/> AI Plagiarism Report</h3>
                            {isHost && contest.plagiarismReport?.status !== 'completed' && (
                                <button onClick={handleAnalyzePlagiarism} disabled={isAnalyzing || contest.plagiarismReport?.status === 'pending'} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-700 transition disabled:bg-blue-300">
                                    {isAnalyzing || contest.plagiarismReport?.status === 'pending' ? <><FaSpinner className="animate-spin"/> Analyzing...</> : 'Analyze Submissions'}
                                </button>
                            )}
                        </div>
                         <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                            {contest.plagiarismReport?.status === 'completed' ? (
                                contest.plagiarismReport.results.length > 0 ? (
                                    <div className="space-y-4">
                                        {contest.plagiarismReport.results.map(result => (
                                            <div key={result.problemId}>
                                                <h4 className="font-semibold">Problem: {contest.problems.find(p => p._id === result.problemId)?.title || 'Unknown Problem'}</h4>
                                                {result.matches.map((match, idx) => (
                                                    <div key={idx} className="border bg-white p-3 rounded-md mt-2">
                                                        <p><strong>Match Found:</strong> {match.users.map(u => u.displayName).join(' & ')}</p>
                                                        <p><strong>Similarity:</strong> <span className="font-bold text-red-600">{match.similarity.toFixed(2)}%</span></p>
                                                        <p className="text-sm text-gray-600 mt-1"><strong>AI Report:</strong> {match.report}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-500">No significant similarities found among submissions.</p>
                                )
                            ) : (
                                <p className="text-center text-gray-500">
                                    {isHost ? 'Click "Analyze Submissions" to check for plagiarism.' : 'The plagiarism report has not been generated by the host.'}
                                </p>
                            )}
                        </div>
                    </div> */}

                </div>
            </div>
        </div>
    );
};

export default ContestResultsPage;