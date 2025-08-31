import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

const CreateContest = () => {
    const navigate = useNavigate();
    const { getToken } = useAuth();
    const [contestName, setContestName] = useState('');
    const [duration, setDuration] = useState(60); // Default 60 minutes
    const [problemBank, setProblemBank] = useState([]);
    const [selectedProblems, setSelectedProblems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/problems`);
                if (!res.ok) throw new Error('Failed to fetch problems');
                const data = await res.json();
                setProblemBank(data);
            } catch (err) {
                setError('Could not load problems. Please try again later.');
            }
        };
        fetchProblems();
    }, []);

    const handleCreateContest = async () => {
        if (!contestName.trim() || selectedProblems.length === 0) {
            alert('Please provide a contest name and select at least one problem.');
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            const token = await getToken();
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/contests/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: contestName,
                    problemIds: selectedProblems.map(p => p._id),
                    duration: duration,
                }),
            });

            const newContest = await response.json();
            if (!response.ok) {
                throw new Error(newContest.message || 'Failed to create contest');
            }
            navigate(`/contest/${newContest.contestId}`);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleProblemSelection = (problem) => {
        setSelectedProblems(prev =>
            prev.find(p => p._id === problem._id)
                ? prev.filter(p => p._id !== problem._id)
                : [...prev, problem]
        );
    };

    return (
        <div className="h-full w-[90%] m-auto mt-20 sm:p-6 lg:p-8 font-sans">
            <div className="max-w-screen-md mx-auto">
                <h1 className="text-4xl font-bold text-gray-900">Create a New Contest</h1>
                <p className="text-lg text-gray-500 mt-2">Set up your private coding challenge.</p>
                {error && <p className="mt-4 text-center text-red-600 bg-red-100 p-3 rounded-lg">{error}</p>}
                <div className="bg-white rounded-xl shadow-sm border mt-8 p-8 space-y-8">
                    <div>
                        <label className="text-lg font-semibold text-gray-800">Contest Name</label>
                        <input
                            type="text"
                            value={contestName}
                            onChange={(e) => setContestName(e.target.value)}
                            placeholder="e.g., Weekend Code-off"
                            className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                     <div>
                        <label className="text-lg font-semibold text-gray-800">Duration (in minutes)</label>
                        <input
                            type="number"
                            value={duration}
                            onChange={(e) => setDuration(Number(e.target.value))}
                            className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    <div>
                        <label className="text-lg font-semibold text-gray-800">Select Problems ({selectedProblems.length})</label>
                        <div className="max-h-60 overflow-y-auto border rounded-lg p-2 space-y-2 mt-2">
                            {problemBank.map(problem => (
                                <div
                                    key={problem._id}
                                    onClick={() => toggleProblemSelection(problem)}
                                    className={`p-3 rounded-lg flex justify-between items-center cursor-pointer transition-colors ${selectedProblems.find(p => p._id === problem._id) ? 'bg-purple-100 border-purple-400' : 'bg-gray-50 hover:bg-gray-100 border-transparent'} border`}
                                >
                                    <span>{problem.title}</span>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${problem.difficulty === 'Easy' ? 'bg-green-200 text-green-800' : problem.difficulty === 'Medium' ? 'bg-yellow-200 text-yellow-800' : 'bg-red-200 text-red-800'}`}>{problem.difficulty}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleCreateContest}
                        className="px-8 py-3 bg-purple-600 text-white rounded-lg font-semibold flex items-center gap-2 hover:bg-purple-700 transition disabled:bg-purple-300 disabled:cursor-not-allowed"
                        disabled={isLoading || !contestName.trim() || selectedProblems.length === 0}
                    >
                        {isLoading ? 'Creating...' : 'Create & Go to Lobby'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateContest;