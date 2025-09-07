import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/clerk-react';
import { Menu, X, ChevronLeft, ChevronRight, Trophy, Users, CheckCircle, Loader2 } from 'lucide-react';
import Header from './Header';
import ProblemDetails from './ProblemDetails';
import CodeEditorSection from './CodeEditorSection';
import { ProctoringProvider, useProctoring } from '../../context/ProctoringContext';
import Webcam from "react-webcam";
import { useSettings } from '../../context/SettingsContext';

const ContestSidebar = ({ contest, problems, currentProblemId, isOpen, onToggle, userProgress }) => {
    const { user } = useUser();
    const { getToken } = useAuth();
    const [leaderboard, setLeaderboard] = useState([]);

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
            } catch (error) {
                console.error("Failed to fetch leaderboard", error);
            }
        };

        fetchLeaderboard();
        const interval = setInterval(fetchLeaderboard, 10000);
        return () => clearInterval(interval);
    }, [contest?.contestId, getToken]);

    return (
        <div className={`text-black bg-dark-panel h-full rounded-lg flex flex-col p-4 overflow-hidden transition-all duration-300 ${isOpen ? 'w-80' : 'w-0 p-0'}`}>
            {isOpen && (
                <>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Trophy className="text-yellow-400" /> {contest?.name}
                        </h2>
                        <button onClick={onToggle} className="p-1 hover:bg-dark-layer-2 rounded">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-6">
                        {/* Problems Section */}
                        <div>
                            <h3 className="font-semibold mb-3 text-blue-500">Problems</h3>
                            <div className="space-y-2">
                                {problems.map((p, index) => (
                                    <Link
                                        key={p._id}
                                        to={`/problems/${p.id}?contestId=${contest.contestId}`}
                                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                                            currentProblemId === p.id 
                                                ? 'bg-primary/30 border border-primary' 
                                                : 'hover:bg-dark-layer-2'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium">{index + 1}.</span>
                                            <span className="truncate">{p.title}</span>
                                        </div>
                                        {userProgress.includes(p._id) && (
                                            <CheckCircle className="text-green-500 flex-shrink-0" size={16} />
                                        )}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Participants Section */}
                        <div>
                            <h3 className="font-semibold mb-3 text-green-500 flex items-center gap-2">
                                <Users size={16} /> Participants ({contest?.participants?.length || 0})
                            </h3>
                            <div className="space-y-2">
                                {contest?.participants?.map((p, index) => (
                                    <div
                                        key={p.userId}
                                        className={`flex justify-between items-center p-2 rounded-lg ${
                                            p.userId === user.id ? 'bg-yellow-500/20' : ''
                                        }`}
                                    >
                                        <span className="text-sm truncate">
                                            {index + 1}. {p.displayName}
                                            {p.userId === user.id && ' (You)'}
                                        </span>
                                        <span className="text-sm font-bold text-yellow-400">{p.score}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Leaderboard Section */}
                        <div>
                            <h3 className="font-semibold mb-3 text-yellow-600">Leaderboard</h3>
                            <div className="space-y-2">
                                {leaderboard.slice(0, 5).map((p, index) => (
                                    <div
                                        key={p.userId}
                                        className={`flex justify-between items-center p-2 rounded-lg ${
                                            p.userId === user.id ? 'bg-yellow-500/20' : ''
                                        }`}
                                    >
                                        <span className="text-sm font-medium">{index + 1}. {p.displayName}</span>
                                        <span className="text-sm font-bold">{p.score} pts</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-dark-border">
                        {/* Optional footer content */}
                    </div>
                </>
            )}
        </div>
    );
};

const ContestCodingPage = () => {
    const { problemId } = useParams();
    const navigate = useNavigate();
    const { getToken } = useAuth();
    const { user } = useUser();
    
    const [problem, setProblem] = useState(null);
    const [contest, setContest] = useState(null);
    const [contestProblems, setContestProblems] = useState([]);
    const [userProgress, setUserProgress] = useState([]);
    
    const [isContestLoading, setIsContestLoading] = useState(true);
    const [isProblemLoading, setIsProblemLoading] = useState(true);

    const [error, setError] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [timeLeft, setTimeLeft] = useState(0);

    // NEW: Handles navigation after a successful submission
    const handleSuccessfulSubmission = useCallback(async (solvedProblemId) => {
        const urlParams = new URLSearchParams(window.location.search);
        const contestId = urlParams.get('contestId');
        if (!contestId || !contestProblems || contestProblems.length === 0) return;

        try {
            // 1. Fetch the latest contest state to get up-to-date progress
            const token = await getToken();
            const contestRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/contests/${contestId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!contestRes.ok) throw new Error('Failed to refresh contest state after submission');
            
            const latestContestData = await contestRes.json();
            setContest(latestContestData);
            
            const currentUser = latestContestData.participants.find(p => p.userId === user.id);
            const solvedIds = currentUser ? currentUser.problemsSolved.map(ps => ps.problemId.toString()) : [];
            setUserProgress(solvedIds);

            // 2. Determine the next step
            const allProblemMongoIds = contestProblems.map(p => p._id.toString());
            const unsolvedProblemIds = allProblemMongoIds.filter(id => !solvedIds.includes(id));

            if (unsolvedProblemIds.length > 0) {
                // Find the next problem to navigate to
                const nextProblemMongoId = unsolvedProblemIds[0];
                const nextProblem = contestProblems.find(p => p._id.toString() === nextProblemMongoId);
                if (nextProblem) {
                    navigate(`/problems/${nextProblem.id}?contestId=${contestId}`);
                }
            } else {
                // All problems are solved, redirect to results
                alert("Congratulations! You have completed all problems. Redirecting to results...");
                navigate(`/contest/results/${contestId}`);
            }
        } catch (e) {
            console.error("Error handling post-submission navigation:", e.message);
            alert("Your solution was submitted, but there was an error navigating to the next problem. Please select it manually.");
        }
    }, [getToken, user.id, contestProblems, navigate]);


    // Effect to load the main contest data once
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const contestId = urlParams.get('contestId');

        const loadContestData = async () => {
            if (!contestId) {
                setError("No Contest ID found in URL.");
                setIsContestLoading(false);
                return;
            };
            
            setIsContestLoading(true);
            try {
                const token = await getToken();
                const contestRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/contests/${contestId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!contestRes.ok) throw new Error('Contest not found');
                const contestData = await contestRes.json();
                setContest(contestData);
                setContestProblems(contestData.problems || []);

                if (contestData.status === 'live' && contestData.startTime) {
                    const endTime = new Date(contestData.startTime).getTime();
                    const remaining = Math.max(0, endTime - Date.now());
                    setTimeLeft(remaining);
                }

                const currentUser = contestData.participants.find(p => p.userId === user.id);
                if (currentUser) {
                    setUserProgress(currentUser.problemsSolved.map(ps => ps.problemId.toString()));
                }
            } catch (e) {
                setError(e.message);
            } finally {
                setIsContestLoading(false);
            }
        };
        loadContestData();
    }, [getToken, user.id]);

    // Effect to load the specific problem data whenever the URL's problemId changes
    useEffect(() => {
        const loadProblemData = async () => {
            if (!problemId) return;
            setIsProblemLoading(true);
            try {
                const problemRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/problems/${problemId}`);
                if (!problemRes.ok) throw new Error('Problem not found');
                const problemData = await problemRes.json();
                setProblem(problemData);
            } catch (e) {
                setError(e.message);
            } finally {
                setIsProblemLoading(false);
            }
        };
        loadProblemData();
    }, [problemId]);

    // Timer countdown effect
    useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => Math.max(0, prev - 1000));
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (milliseconds) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleSubmitContest = async () => {
        if (window.confirm("Are you sure you want to submit the entire contest? This action cannot be undone.")) {
            try {
                const token = await getToken();
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/contests/${contest.contestId}/submit`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    navigate(`/contest/results/${contest.contestId}`);
                } else {
                    alert('Failed to submit contest');
                }
            } catch (error) {
                console.error('Error submitting contest:', error);
                alert('Error submitting contest');
            }
        }
    };
    
    if (isContestLoading) return <div className="bg-dark-bg text-white h-screen flex items-center justify-center">Loading Contest...</div>;
    if (error) return <div className="bg-dark-bg text-white h-screen flex items-center justify-center">Error: {error}</div>;
    if (!contest) return <div className="bg-dark-bg text-white h-screen flex items-center justify-center">Could not load contest data.</div>;

    return (
        <ProctoringProvider problemId={problemId} contestId={contest?.contestId}>
            <ContestCodingView 
                problem={problem}
                contest={contest}
                contestProblems={contestProblems}
                userProgress={userProgress}
                timeLeft={formatTime(timeLeft)}
                onSubmitContest={handleSubmitContest}
                isSidebarOpen={isSidebarOpen}
                onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                onContestSubmit={handleSuccessfulSubmission}
                isProblemLoading={isProblemLoading}
            />
        </ProctoringProvider>
    );
};

const ContestCodingView = ({ 
    problem, 
    contest, 
    contestProblems, 
    userProgress, 
    timeLeft, 
    onSubmitContest,
    isSidebarOpen,
    onToggleSidebar,
    onContestSubmit,
    isProblemLoading
}) => {
    const {
        isProctoringActive, startProctoring, isDisqualified,
        warningMessage, infractionCount, MAX_INFRACTIONS, webcamRef
    } = useProctoring();

    const [mycode, setTestcode] = useState('');

    if (!isProctoringActive) {
        return (
            <div className="bg-dark-bg text-black h-screen flex flex-col items-center justify-center text-center p-8">
                <h1 className="text-3xl font-bold mb-4 text-white">Contest Instructions</h1>
                <div className="bg-dark-panel p-6 rounded-lg border border-dark-border max-w-2xl text-white">
                    <p className="mb-4 text-black">This is a proctored test session. Rules are enforced:</p>
                    <ul className="list-disc list-inside text-left mb-6 space-y-2 text-black">
                        <li>Webcam monitoring enabled</li>
                        <li>Fullscreen mode required</li>
                        <li>Tab switching is prohibited</li>
                        <li>Copy/paste disabled</li>
                    </ul>
                    <p className="font-bold text-yellow-400 mb-6">Warnings: {MAX_INFRACTIONS}. Exceeding results in disqualification.</p>
                    <button onClick={startProctoring} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">
                        I Understand, Start Test
                    </button>
                </div>
            </div>
        );
    }

    if (isDisqualified) {
        return (
            <div className="bg-dark-bg text-white h-screen flex flex-col items-center justify-center text-center p-8">
                <div className="bg-dark-panel p-8 rounded-lg border border-red-500 max-w-md">
                    <h2 className="text-2xl font-bold text-red-500 mb-4">Disqualified</h2>
                    <p className='text-black'>{warningMessage}</p>
                    <p className="text-black mt-4">Your session has been terminated.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-dark-bg font-sans flex flex-col relative">
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="absolute top-0 left-0 opacity-0 pointer-events-none"
            />
            
            <Header problemTitle={problem?.title || "Loading Problem..."} />
            
            {warningMessage && !isDisqualified && (
                <div className="w-[95%] max-w-screen-2xl mx-auto mt-2 p-3 bg-yellow-900/50 border border-yellow-400 text-yellow-300 rounded-lg text-center font-semibold">
                    {warningMessage} (Infractions: {infractionCount}/{MAX_INFRACTIONS})
                </div>
            )}

            <div className="w-[95%] max-w-screen-2xl mx-auto mt-4 p-4 bg-dark-panel rounded-lg flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <button onClick={onToggleSidebar} className="p-2 bg-dark-layer-2 rounded-lg hover:bg-dark-layer-1">
                        {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                    </button>
                    <div className="text-xl font-bold text-yellow-400">{timeLeft}</div>
                </div>
                
                <div className="flex items-center gap-4">
                    <button 
                        onClick={onSubmitContest} 
                        className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                    >
                        Submit Contest
                    </button>
                </div>
            </div>

            <main className="flex-grow flex w-full max-w-screen-full p-4 gap-4 overflow-hidden">
                <ContestSidebar 
                    contest={contest}
                    problems={contestProblems}
                    currentProblemId={problem?.id}
                    isOpen={isSidebarOpen}
                    onToggle={onToggleSidebar}
                    userProgress={userProgress}
                />
                
                <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {isProblemLoading || !problem ? (
                        <div className="col-span-2 flex items-center justify-center h-full bg-dark-panel rounded-lg">
                           <Loader2 className="animate-spin text-white" size={48} />
                        </div>
                    ) : (
                        <>
                            <div className="h-full">
                                <ProblemDetails problem={problem} mycode={mycode} setTestCode={setTestcode} />
                            </div>
                            <div className="h-full">
                                <CodeEditorSection 
                                  problem={problem} 
                                  mycode={mycode} 
                                  setTestCode={setTestcode} 
                                  onContestSubmit={onContestSubmit}
                                />
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ContestCodingPage;