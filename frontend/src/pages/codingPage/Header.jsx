import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import {useProctoring} from '../../context/ProctoringContext';
// --- START: Icon Imports ---
import {
  IoLogoJavascript,
  IoLogoPython,
  IoSunny,
} from 'react-icons/io5';
import { FaJava, FaGithub } from 'react-icons/fa';
import { TbBrandCpp, TbBrandVscode } from 'react-icons/tb';
import { SiSololearn } from 'react-icons/si'; // Using this for Dracula
// --- END: Icon Imports ---


// --- START: Updated Data with Icons ---
const THEMES = [
  { name: 'VS Dark', value: 'monokai', icon: <TbBrandVscode className="w-5 h-5" /> },
  { name: 'Dracula', value: 'dracula', icon: <SiSololearn className="w-5 h-5" /> },
  { name: 'GitHub', value: 'github', icon: <FaGithub className="w-5 h-5" /> },
  { name: 'Solarized Light', value: 'solarized_light', icon: <IoSunny className="w-5 h-5" /> },
];

const LANGUAGES = [
  { name: 'JavaScript', value: 'javascript', icon: <IoLogoJavascript className="text-yellow-400 w-5 h-5" /> },
  { name: 'Python', value: 'python', icon: <IoLogoPython className="text-blue-500 w-5 h-5" /> },
  { name: 'Java', value: 'java', icon: <FaJava className="text-red-500 w-5 h-5" /> },
  { name: 'C++', value: 'cpp', icon: <TbBrandCpp className="text-blue-600 w-5 h-5" /> },
];
// --- END: Updated Data with Icons ---


const Dropdown = ({ options, selected, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === selected);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setIsOpen(false)} // Close dropdown when it loses focus
        className="flex items-center space-x-2 bg-dark-panel border border-dark-border rounded-md px-3 py-1.5 text-sm hover:bg-dark-hover"
      >
        {selectedOption.icon}
        <span>{selectedOption.name}</span>
      </button>
      
      {/* Dropdown Panel */}
      {isOpen && (
        <div 
          // --- START: Style Fix for Transparency/Layering ---
          className="absolute top-full right-0 mt-2 w-48 bg-white border border-dark-border rounded-md shadow-lg z-50"
          // --- END: Style Fix ---
          onMouseDown={(e) => e.preventDefault()} // Prevents onBlur from firing on click
        >
          {options.map(option => (
            <button
              key={option.value}
              onClick={() => {
                onSelect(option.value);
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-dark-header flex items-center space-x-3"
            >
              {option.icon}
              <span>{option.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};


const Header = ({ problemTitle }) => {
  const { theme, setTheme, language, setLanguage } = useSettings();
  const { isProctoringActive } = useProctoring(); // Get proctoring state
  const navigate = useNavigate();

  const handleNavigation = (e, path) => {
    // If proctoring is active, prevent navigation and show a warning
    if (isProctoringActive) {
      e.preventDefault();
      if (window.confirm("Are you sure you want to leave the test? This will be counted as an infraction and may result in disqualification.")) {
        // The act of leaving will trigger an infraction from the fullscreen/tab-switch hooks.
        // You can also manually log an "abandon" infraction here before navigating.
        navigate(path);
      }
    }
  };

  return (
    <header className=" text-primary px-4 py-2 flex justify-between items-center border-b border-dark-border w-[95%] mx-10 mt-4 rounded-t-lg">
      <div className="flex flex-col">
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm text-text-secondary">
          <Link to="/home" onClick={(e) => handleNavigation(e, '/home')} className="flex items-center hover:text-text-primary cursor-pointer">
            <Home className="w-4 h-4 mr-2" />
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/problems" onClick={(e) => handleNavigation(e, '/problems')} className="mx-2 hover:text-text-primary cursor-pointer">
            Problems
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-text-primary font-semibold ml-2 ">{problemTitle}</span>
        </div>
      </div>

      {/* Right side controls */}
      <div className="flex items-center space-x-4">
        {/* Dropdowns should be disabled or hidden during proctoring if they can be distracting */}
       
          <Dropdown options={THEMES} selected={theme} onSelect={setTheme} />
        
          <Dropdown options={LANGUAGES} selected={language} onSelect={setLanguage} />
      </div>
    </header>
  );
};

export default Header;