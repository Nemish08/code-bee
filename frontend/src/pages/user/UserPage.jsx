import React, { useState, useEffect, useMemo } from 'react';
import { FaRegUser, FaCode, FaKey, FaFire, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import { RiEraserFill } from 'react-icons/ri';
import { BsLightningChargeFill, BsGraphUp, BsListUl, BsCollectionPlay } from 'react-icons/bs';
import { IoSparkles } from 'react-icons/io5';
import { FiClock, FiTrendingUp } from 'react-icons/fi';
// **FIX 1: Import 'useAuth' from Clerk**
import { useUser, useAuth } from '@clerk/clerk-react';


// --- MOCK DATA (will be replaced by API call) ---
const mockDashboardData = {
  profile: {
    rank: 137,
    streak: 5,
    questionsSolved: 8,
    totalQuestions: 33,
  },
  stats: {
    totalRuns: 42,
    successRate: '76%',
    last24hRuns: 3,
    languagesUsed: 3,
    mostUsedLanguage: 'JavaScript',
  },
  activity: [
    { date: new Date(Date.now() - 86400000 * 1).toISOString(), count: 3 },
    { date: new Date(Date.now() - 86400000 * 2).toISOString(), count: 5 },
    { date: new Date(Date.now() - 86400000 * 3).toISOString(), count: 1 },
    { date: new Date(Date.now() - 86400000 * 6).toISOString(), count: 8 },
    { date: new Date(Date.now() - 86400000 * 10).toISOString(), count: 2 },
    { date: new Date(Date.now() - 86400000 * 30).toISOString(), count: 4 },
  ],
  executions: [
    { _id: 'exec1', status: 'success', language: 'JavaScript', createdAt: new Date(Date.now() - 3600000).toISOString() },
    { _id: 'exec2', status: 'error', language: 'Python', createdAt: new Date(Date.now() - 7200000).toISOString() },
    { _id: 'exec3', status: 'success', language: 'JavaScript', createdAt: new Date(Date.now() - 86400000).toISOString() },
    { _id: 'exec4', status: 'timeout', language: 'Java', createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
    { _id: 'exec5', status: 'success', language: 'Python', createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
  ],
  playlists: [
    { _id: 'pl1', name: 'Dynamic Programming Practice', description: 'Collection of DP problems to master the concept.', questionIds: ['dp1', 'dp2', 'dp5'] },
    { _id: 'pl2', name: 'Graph Traversal', description: 'BFS and DFS problems.', questionIds: ['graph1', 'graph3'] },
  ],
};


// Main Dashboard Component
const UserProfileDashboard = () => {
  const { isLoaded } = useUser();
  // **FIX 2: Call the 'useAuth' hook to get the getToken function**
  const { getToken } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // We need both the user to be loaded and getToken to be available.
    if (isLoaded && getToken) {
      const fetchDashboardData = async () => {
        setLoading(true);
        try {
          const token = await getToken();
          if (!token) {
            throw new Error("Authentication token is not available.");
          }

          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/dashboard`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Failed to fetch dashboard data. Status: ${response.status}`);
          }

          const data = await response.json();
          setDashboardData(data);
          setError(null);
        } catch (err) {
          setError(err.message);
          console.error("Error fetching dashboard data:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchDashboardData();
    }
    // **FIX 3: Add 'getToken' to the dependency array**
  }, [isLoaded, getToken]);

  if (loading || !isLoaded) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-4xl text-purple-600" />
        <p className="mt-4 text-gray-500">Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-red-50">
        <FaExclamationTriangle className="text-5xl text-red-500" />
        <h2 className="mt-4 text-2xl font-bold text-red-700">Oops! Something went wrong.</h2>
        <p className="mt-2 text-gray-600">{error}</p>
      </div>
    );
  }

  // **FIX 4: Use a default structure if dashboardData is null to prevent further errors**
  if (!dashboardData) {
     return <div className="text-center mt-20 text-gray-500">No dashboard data available yet. Start solving some problems!</div>;
  }
  
  // Now we can safely assume dashboardData and its nested properties exist
  return (
    <div className="h-full w-[90%] m-auto mt-20 sm:p-6 lg:p-8 font-sans text-gray-900">
      <div className="max-w-screen-xl mx-auto">
        <ProfileHeader />
        <StatsSection stats={dashboardData.stats} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2">
            <ActivityOverview activity={dashboardData.activity} />
          </div>
          <LearningProgress progress={dashboardData.profile} />
        </div>
        <CodeExecutionsSection
          executions={dashboardData.executions}
          playlists={dashboardData.playlists}
        />
      </div>
    </div>
  );
};


// --- SUB-COMPONENTS ---

const ProfileHeader = () => {
  const { user } = useUser();
  if (!user) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center">
        <div className="relative">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200">
            <img className='object-cover w-full h-full' src={user.imageUrl} alt={user.fullName}/>
          </div>
          <div className="absolute -top-1 -right-1 bg-orange-500 rounded-full p-2 border-4 border-white">
            <BsLightningChargeFill className="text-white text-base" />
          </div>
        </div>
        <div className="ml-6">
          <h1 className="text-2xl font-bold">{user.fullName}</h1>
          <p className="text-gray-500 flex items-center mt-1">
            <FaRegUser className="mr-2" />
            {user.primaryEmailAddress.emailAddress}
          </p>
        </div>
      </div>
      <div className="flex items-center mt-4 sm:mt-0 space-x-2">
        <button onClick={() => alert('Navigate to Edit Profile page!')} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-100 transition">
          Edit profile
        </button>
        <button onClick={() => alert('Open Erase Data modal!')} className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold flex items-center hover:bg-purple-700 transition">
          <RiEraserFill className="mr-2" />
          Erase
        </button>
      </div>
    </div>
  );
};

const StatCard = ({ icon, iconBg, title, value, subtitle, footerIcon, footerText }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col justify-between">
    <div>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
        </div>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBg}`}>{icon}</div>
      </div>
    </div>
    <div className="border-t border-gray-100 mt-4 pt-4 flex items-center text-gray-500 text-sm">
      {footerIcon}
      <span className="ml-2">{footerText}</span>
    </div>
  </div>
);

const StatsSection = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      <StatCard icon={<BsGraphUp className="text-white text-xl" />} iconBg="bg-blue-500" title="Total code runs" value={stats.totalRuns} subtitle="Code Executions" footerIcon={<FiClock />} footerText={`Last 24h: ${stats.last24hRuns || 0}`} />
      <StatCard icon={<IoSparkles className="text-white text-xl" />} iconBg="bg-orange-500" title="Percentage of successful runs" value={stats.successRate} subtitle="Success Rate" footerIcon={<FiTrendingUp/>} footerText="vs. last week" />
      <StatCard icon={<FaCode className="text-white text-xl" />} iconBg="bg-pink-500" title="Different languages" value={stats.languagesUsed} subtitle="Languages Used" footerIcon={<FiTrendingUp />} footerText={`Most used: ${stats.mostUsedLanguage}`} />
    </div>
  );
};



const ActivityOverview = ({ activity }) => {
  const [tooltip, setTooltip] = useState({ visible: false, content: '', x: 0, y: 0 });

  const { days, months, totalContributions } = useMemo(() => {
    const activityMap = new Map(activity.map(a => [new Date(a.date).toISOString().split('T')[0], a.count]));
    const total = activity.reduce((sum, act) => sum + act.count, 0);

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 364);
    while (startDate.getDay() !== 0) {
      startDate.setDate(startDate.getDate() - 1);
    }

    const gridDays = [];
    const monthLabels = [];
    let currentMonth = -1;

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateString = d.toISOString().split('T')[0];
      gridDays.push({ date: new Date(d), count: activityMap.get(dateString) || 0 });

      if (d.getMonth() !== currentMonth) {
        currentMonth = d.getMonth();
        monthLabels.push({
          name: d.toLocaleString('default', { month: 'short' }),
          colStart: Math.floor(gridDays.length / 7) + 1,
        });
      }
    }
    return { days: gridDays, months: monthLabels, totalContributions: total };
  }, [activity]);

  const getContributionColor = (count) => {
    if (count === 0) return 'bg-gray-200 hover:bg-gray-300';
    if (count <= 2) return 'bg-green-200 hover:bg-green-300';
    if (count <= 5) return 'bg-green-400 hover:bg-green-500';
    if (count <= 9) return 'bg-green-600 hover:bg-green-700';
    return 'bg-green-800 hover:bg-green-900';
  };
  
  const handleMouseEnter = (day, event) => {
    const square = event.currentTarget;
    const container = square.closest('.relative');
    if (!container) return;

    const squareRect = square.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    const x = squareRect.left - containerRect.left + squareRect.width / 2;
    const y = squareRect.top - containerRect.top;

    setTooltip({
      visible: true,
      content: `${day.count} contributions on ${day.date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}`,
      x: x,
      y: y
    });
  };

  const handleMouseLeave = () => setTooltip(prevState => ({ ...prevState, visible: false }));

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 h-full relative">
      {tooltip.visible && (
        <div className="absolute z-10 px-3 py-1.5 text-sm font-semibold text-white bg-gray-900 rounded-md shadow-lg"
          style={{ 
            left: `${tooltip.x}px`, 
            top: `${tooltip.y}px`, 
            transform: 'translateX(-50%) translateY(calc(-100% - 8px))', // Added 8px gap
            pointerEvents: 'none' 
          }} >
          {tooltip.content}
        </div>
      )}

      <h2 className="font-bold text-lg">Activity Overview</h2>
      <p className="text-sm text-gray-500">{totalContributions} contributions in the last year</p>
      
      <div className="mt-4 overflow-x-auto pb-2">
        <div className="inline-grid" style={{ gridTemplateAreas: '\"empty months\" \"days graph\"', gridTemplateColumns: 'auto 1fr' }}>
          {/* Month Labels */}
          <div className="grid grid-flow-col gap-1" style={{ gridArea: 'months' }}>
            {months.map(month => (
              <div key={month.name + month.colStart} className="text-xs text-gray-500 -translate-x-1/2" style={{ gridColumnStart: month.colStart }}>
                {month.name}
              </div>
            ))}
          </div>

          {/* Day Labels */}
          <div className="flex flex-col text-xs text-gray-400 mr-2" style={{ gridArea: 'days' }}>
            {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((day, i) => (
              <div key={i} className="h-3.5 flex items-center mt-1">{day}</div>
            ))}
          </div>
          
          {/* Graph */}
          <div className="grid grid-flow-col grid-rows-7 gap-1" style={{ gridArea: 'graph' }}>
            {days.map((day) => (
              <div key={day.date.toISOString()}
                className={`w-3.5 h-3.5 rounded-sm transition-colors ${getContributionColor(day.count)}`}
                onMouseEnter={(e) => handleMouseEnter(day, e)}
                onMouseLeave={handleMouseLeave} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const LearningProgress = ({ progress }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="font-bold text-lg">Your learning progress</h2>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center"><div className="flex items-center justify-center text-orange-500"><FaKey className="mr-1" /><span className="text-sm font-semibold text-gray-600">Rank</span></div><p className="text-2xl font-bold mt-1">{progress.rank}</p></div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center"><div className="flex items-center justify-center text-orange-500"><FaFire className="mr-1" /><span className="text-sm font-semibold text-gray-600">Streak</span></div><p className="text-2xl font-bold mt-1">{progress.streak} days</p></div>
      </div>
      <div className="mt-6">
        <div className="flex justify-between items-center text-sm"><span className="font-semibold">Questions Solved</span><span className="text-gray-500">{progress.questionsSolved} / {progress.totalQuestions}</span></div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2"><div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${(progress.totalQuestions > 0 ? (progress.questionsSolved / progress.totalQuestions) : 0) * 100}%` }}></div></div>
        <div className="mt-4 flex items-center text-sm text-green-600 font-semibold"><BsGraphUp className="mr-2 text-lg" /><span>Keep going! You're making great progress.</span></div>
      </div>
    </div>
  );
};

const CodeExecutionsSection = ({ executions, playlists }) => {
  const [activeTab, setActiveTab] = useState('executions');
  const getStatusPill = (status) => {
    switch (status) { case 'success': return 'bg-green-100 text-green-800'; case 'error': return 'bg-red-100 text-red-800'; case 'timeout': return 'bg-yellow-100 text-yellow-800'; default: return 'bg-gray-100 text-gray-800'; }
  };
  return (
    <div className="bg-white rounded-xl shadow-sm mt-6">
      <div className="px-6 border-b border-gray-200"><nav className="flex -mb-px"><button onClick={() => setActiveTab('executions')} className={`px-3 py-3 text-sm font-semibold flex items-center transition-colors duration-200 ${activeTab === 'executions' ? 'text-green-700 bg-green-100 rounded-t-lg' : 'text-gray-500 hover:text-gray-700'}`}><BsListUl className="mr-2" /> Code Executions</button><button onClick={() => setActiveTab('playlists')} className={`ml-2 px-3 py-3 text-sm font-semibold flex items-center transition-colors duration-200 ${activeTab === 'playlists' ? 'text-green-700 bg-green-100 rounded-t-lg' : 'text-gray-500 hover:text-gray-700'}`}><BsCollectionPlay className="mr-2" /> My Playlists</button></nav></div>
      <div className="p-6">
        {activeTab === 'executions' && (
          <div>{executions && executions.length > 0 ? (<ul className="space-y-3">{(executions || []).map((exec) => (<li key={exec._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"><div className='flex items-center gap-4'><span className={`px-2 py-1 text-xs font-bold rounded-full ${getStatusPill(exec.status)}`}>{exec.status.toUpperCase()}</span><span className='font-mono text-sm text-gray-700'>{exec.language}</span></div><span className="text-sm text-gray-500">{new Date(exec.createdAt).toLocaleString()}</span></li>))}</ul>) : (<div className="text-center text-gray-400 py-10">No code execution history found.</div>)}</div>
        )}
        {activeTab === 'playlists' && (
           <div>{playlists && playlists.length > 0 ? (<ul className="space-y-4">{(playlists || []).map((pl) => (<li key={pl._id} className="p-4 bg-gray-50 rounded-lg border border-gray-200"><h3 className="font-semibold text-gray-800">{pl.name}</h3><p className="text-sm text-gray-600 mt-1">{pl.description}</p><p className="text-xs text-gray-500 mt-2 font-medium">{pl.questionIds.length} questions</p></li>))}</ul>) : (<div className="text-center text-gray-400 py-10">You haven't created any playlists yet.</div>)}</div>
        )}
      </div>
    </div>
  );
};

export default UserProfileDashboard;