import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Header from './Header';
import ProblemDetails from './ProblemDetails';
import CodeEditorSection from './CodeEditorSection';
import { ProctoringProvider, useProctoring } from '../../context/ProctoringContext';
import ContestSidebar from './ContestSidebar';
import Webcam from "react-webcam";

// ====================================================================================
// VIEW 1: Standard, non-proctored coding view
// ====================================================================================
const StandardView = ({ problem }) => {
    const [mycode, setTestCode] = useState('');
    return (
        <div className="h-full bg-dark-bg font-sans flex flex-col">
            <Header problemTitle={problem.title} />
            <main className=" grid grid-cols-1 md:grid-cols-2 gap-4 p-4 overflow-hidden">
                <div className="h-100%">
                    <ProblemDetails problem={problem} mycode={mycode} setTestCode={setTestCode} />
                </div>
                <div className="h-full">
                    <CodeEditorSection problem={problem} mycode={mycode} setTestCode={setTestCode} />
                </div>
            </main>
        </div>
    );
};


// ====================================================================================
// VIEW 2: Proctored contest view
// ====================================================================================
const ProctoredContestView = ({ problem, contest, contestProblems }) => {
    const {
        isProctoringActive, startProctoring, isDisqualified,
        warningMessage, infractionCount, MAX_INFRACTIONS, webcamRef
    } = useProctoring();

    const [mycode, setTestcode] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    if (!isProctoringActive) {
        return (
            <div className="bg-dark-bg text-black h-screen flex flex-col items-center justify-center text-center p-8">
                <h1 className="text-3xl font-bold mb-4 text-white">Contest Instructions</h1>
                <div className="bg-dark-panel p-6 rounded-lg border border-dark-border max-w-2xl text-white">
                    <p className="mb-4 text-black">This is a proctored test session. To ensure fairness, the following rules are enforced:</p>
                    <ul className="list-disc list-inside text-left mb-6 space-y-2 text-black">
                        <li>Your webcam will be monitored during the session.</li>
                        <li>The test will run in <b>fullscreen mode</b>.</li>
                        <li><b>Switching tabs</b> or applications will count as an infraction.</li>
                        <li><b>Exiting fullscreen</b> will also count as an infraction.</li>
                        <li><b>Copy, paste, and right-click</b> are disabled.</li>
                    </ul>
                    <p className="font-bold text-yellow-400 mb-6">You have {MAX_INFRACTIONS} warnings. Exceeding them will result in disqualification.</p>
                    <button onClick={startProctoring} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">  I Understand, Start Test </button>
                </div>
            </div>
        );
    }

    if (isDisqualified) {
        return (
            <div className="bg-dark-bg text-white h-screen flex flex-col items-center justify-center text-center p-8">
                <div className="bg-dark-panel p-8 rounded-lg border border-red-500 max-w-md">
                    <h2 className="text-2xl font-bold text-red-500 mb-4">Session Disqualified</h2>
                    <p className='text-black'>{warningMessage}</p>
                    <p className="text-black mt-4 text-text-secondary">Your session has been terminated.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-dark-bg font-sans flex flex-col relative">
            {/* Webcam component for monitoring, hidden from view */}
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="absolute top-0 left-0 opacity-0 pointer-events-none"
            />
            <Header problemTitle={problem.title} />
            {warningMessage && !isDisqualified && (<div className="w-[95%] max-w-screen-2xl mx-auto mt-2 p-3 bg-yellow-900/50 border border-yellow-400 text-yellow-300 rounded-lg text-center font-semibold"> {warningMessage} (Infractions: {infractionCount}/{MAX_INFRACTIONS})</div>)}
            <main className="flex-grow flex w-full max-w-screen-full p-4 gap-4 overflow-hidden">           
            
            <div className={`transition-all duration-300 ${isSidebarOpen ? 'w-1/4 min-w-[300px]' : 'w-0'}`}>                  
            <ContestSidebar contest={contest} problems={contestProblems} isOpen={isSidebarOpen} />
            </div>
                <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="h-full relative">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="absolute top-2 left-2 z-20 p-2 bg-dark-panel/80 hover:bg-primary/50 rounded-full transition-colors">{isSidebarOpen ? <X className="text-white" size={20} /> : <Menu className="text-white" size={20} />}  </button>
                        <ProblemDetails problem={problem} mycode={mycode} setTestCode={setTestcode} />
                    </div>
                <div className="h-full">                        
                    <CodeEditorSection problem={problem} mycode={mycode} setTestCode={setTestcode} />
                </div>
            </div>
            </main>
        </div>
    );
};


// ====================================================================================
// MAIN EXPORTED COMPONENT
// ====================================================================================
function CodingPage() {
    const { problemId } = useParams();
    const location = useLocation();
    const contestId = new URLSearchParams(location.search).get('contestId');

    const [problem, setProblem] = useState(null);
    const [contest, setContest] = useState(null);
    const [contestProblems, setContestProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProblemAndContestData = async () => {
            try {
                setLoading(true);
                setError(null);

                const problemRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/problems/${problemId}`);
                if (!problemRes.ok) throw new Error('Problem not found');
                const problemData = await problemRes.json();
                setProblem(problemData);

                if (contestId) {
                    const token = await window.Clerk.session.getToken();
                    const contestRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/contests/${contestId}`, { headers: { 'Authorization': `Bearer ${token}` } });
                    if (!contestRes.ok) throw new Error('Contest not found');
                    const contestData = await contestRes.json();
                    setContest(contestData);
                    setContestProblems(contestData.problems);
                }
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };

        if (problemId) {
            fetchProblemAndContestData();
        }
    }, [problemId, contestId]);

    if (loading) return <div className="bg-dark-bg text-white h-screen flex items-center justify-center">Loading...</div>;
    if (error) return <div className="bg-dark-bg text-white h-screen flex items-center justify-center">Error: {error}</div>;
    if (!problem) return null;

    return (
        <ProctoringProvider problemId={problem.id} contestId={contestId}>{contestId && contest ? (<ProctoredContestView problem={problem} contest={contest} contestProblems={contestProblems}
        />
        ) : (<StandardView problem={problem} />
        )}
        </ProctoringProvider>
    );
}

export default CodingPage;