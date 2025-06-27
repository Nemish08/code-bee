// src/App.jsx

import React, { useState } from 'react';
import { FaRegUser, FaCode, FaKey, FaFire } from 'react-icons/fa';
import { RiEraserFill } from 'react-icons/ri';
import { BsLightningChargeFill, BsGraphUp, BsListUl, BsCollectionPlay } from 'react-icons/bs';
import { IoSparkles } from 'react-icons/io5';
import { FiClock, FiTrendingUp } from 'react-icons/fi';
import { useUser, useClerk } from '@clerk/clerk-react';

// Main Dashboard Component
const UserProfileDashboard = () => {
  return (
    <div className=" h-full w-[90%] m-auto  mt-20 sm:p-6 lg:p-8 font-sans text-gray-900">
      <div className="max-w-screen-xl mx-auto">
        <ProfileHeader />
        <StatsSection />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2">
            <ActivityOverview />
          </div>
          <LearningProgress />
        </div>
        <CodeExecutionsSection />
      </div>
    </div>
  );
};

// Sub-components for each section

const ProfileHeader = () => {
  const {user} = useUser()
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center">
        <div className="relative">
          <div className="w-20 h-20 rounded-full overflow-hidden">
            <img className=' object-contain w-[100%] h-[100%]' src={user.imageUrl}/>
          </div>
          <div className="absolute -top-1 -right-1 bg-orange-500 rounded-full p-2 border-4 border-white">
            <BsLightningChargeFill className="text-white text-base" />
          </div>
        </div>
        <div className="ml-6">
          <h1 className="text-2xl font-bold">user Name</h1>
          <p className="text-gray-500 flex items-center mt-1">
            <FaRegUser className="mr-2" />
            {user.primaryEmailAddress.emailAddress}
          </p>
        </div>
      </div>
      <div className="flex items-center mt-4 sm:mt-0 space-x-2">
        <button
          onClick={() => alert('Edit Profile clicked!')}
          className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-100 transition"
        >
          Edit profile
        </button>
        <button
          onClick={() => alert('Erase clicked!')}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold flex items-center hover:bg-purple-700 transition"
        >
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
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
      </div>
    </div>
    <div className="border-t border-gray-100 mt-4 pt-4 flex items-center text-gray-500 text-sm">
      {footerIcon}
      <span className="ml-2">{footerText}</span>
    </div>
  </div>
);

const StatsSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      <StatCard
        icon={<BsGraphUp className="text-white text-xl" />}
        iconBg="bg-blue-500"
        title="Total code runs"
        value="2"
        subtitle="Code Executions"
        footerIcon={<FiClock />}
        footerText="Last 24h: 0"
      />
      <StatCard
        icon={<IoSparkles className="text-white text-xl" />}
        iconBg="bg-orange-500"
        title="Percentage of successful runs"
        value="0%"
        subtitle="Success Rate"
        footerIcon={<FiTrendingUp/>}
        footerText="Total solved: 0"
      />
      <StatCard
        icon={<FaCode className="text-white text-xl" />}
        iconBg="bg-pink-500"
        title="Different languages"
        value="2"
        subtitle="Languages Used"
        footerIcon={<FiTrendingUp />}
        footerText="Most used: Python"
      />
    </div>
  );
};

const ActivityOverview = () => {
  const totalDays = 48 * 3; // Approx. 48 columns with 3 rows
  const activityData = Array.from({ length: totalDays }, (_, i) => ({ id: i, active: false }));
  // Mark a day as active, like in the screenshot (Tuesday in the 11th column)
//   const redSquareIndex = 10 * 3 + 1; 
//   activityData[redSquareIndex].active = true;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 h-full">
      <h2 className="font-bold text-lg">Activity Overview</h2>
      <p className="text-sm text-gray-500">2 contributions in the selected period</p>
      <div className="mt-4 flex">
        <div className="flex flex-col justify-between text-xs text-gray-400 mr-2 py-1 space-y-3">
          <span>Mon</span>
          <span>Wed</span>
          <span>Fri</span>
          
        </div>
        <div className="grid grid-flow-col grid-rows-5 gap-1 w-full overflow-x-auto">
          {activityData.map(day => (
            <div
              key={day.id}
              className={`w-3.5 h-3.5 rounded-sm ${day.active ? 'bg-red-400' : 'bg-gray-200'}`}
              title={day.active ? "2 Contributions" : "No contributions"}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

const LearningProgress = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="font-bold text-lg">Your learning progress</h2>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center text-orange-500">
            <FaKey className="mr-1" />
            <span className="text-sm font-semibold text-gray-600">Rank</span>
          </div>
          <p className="text-2xl font-bold mt-1">4</p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center text-orange-500">
            <FaFire className="mr-1" />
            <span className="text-sm font-semibold text-gray-600">Streak</span>
          </div>
          <p className="text-2xl font-bold mt-1">1 days</p>
        </div>
      </div>
      <div className="mt-6">
        <div className="flex justify-between items-center text-sm">
          <span className="font-semibold">Questions</span>
          <span className="text-gray-500">0 / 33</span>
        </div>
        <div className="mt-4 flex items-center text-sm text-green-600 font-semibold">
          <BsGraphUp className="mr-2 text-lg" />
          <span>Keep going! You're making great progress.</span>
        </div>
      </div>
    </div>
  );
};

const CodeExecutionsSection = () => {
  const [activeTab, setActiveTab] = useState('executions');

  return (
    <div className="bg-white rounded-xl shadow-sm mt-6">
      <div className="px-6 border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('executions')}
            className={`px-3 py-3 text-sm font-semibold flex items-center transition-colors duration-200
              ${activeTab === 'executions'
                ? 'text-green-700 bg-green-100 rounded-t-lg'
                : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            <BsListUl className="mr-2" />
            Code Executions
          </button>
          <button
            onClick={() => setActiveTab('playlists')}
            className={`ml-2 px-3 py-3 text-sm font-semibold flex items-center transition-colors duration-200
              ${activeTab === 'playlists'
                ? 'text-green-700 bg-green-100 rounded-t-lg'
                : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            <BsCollectionPlay className="mr-2" />
            My Playlists
          </button>
        </nav>
      </div>
      <div className="p-6">
        {activeTab === 'executions' && (
          <div className="text-center text-gray-400 py-10">
            Code execution history will be displayed here.
          </div>
        )}
        {activeTab === 'playlists' && (
          <div className="text-center text-gray-400 py-10">
            Your playlists will be displayed here.
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileDashboard;