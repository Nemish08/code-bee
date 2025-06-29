import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, Bookmark, Share2, Sun, Moon, Languages } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

const THEMES = [
  { name: 'VS Dark', value: 'monokai' },
  { name: 'Solarized Light', value: 'solarized_light' },
  { name: 'GitHub', value: 'github' },
  { name: 'Dracula', value: 'dracula' },
];

const LANGUAGES = [
  { name: 'JavaScript', value: 'javascript', icon: 'JS' },
  { name: 'Python', value: 'python', icon: 'Py' },
  { name: 'Java', value: 'java', icon: 'J' },
  { name: 'C++', value: 'cpp', icon: 'C++' },
];

const Dropdown = ({ options, selected, onSelect, label, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === selected);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center bg-dark-panel border border-dark-border rounded-md px-3 py-1.5 text-sm hover:bg-dark-hover"
      >
        {Icon && <Icon className="w-4 h-4 mr-2" />}
        <span>{selectedOption ? selectedOption.name : label}</span>
      </button>
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-dark-panel border border-dark-border rounded-md shadow-lg z-10">
          {options.map(option => (
            <button
              key={option.value}
              onClick={() => {
                onSelect(option.value);
                setIsOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-dark-header"
            >
              {option.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};


const Header = ({ problemTitle }) => {
  const { theme, setTheme, language, setLanguage } = useSettings();
  
  return (
    <header className="bg-dark-header text-text-primary px-4 py-2 flex justify-between items-center border-b border-dark-border w-[95%] max-w-screen-2xl mt-4 rounded-t-lg">
      <div className="flex flex-col">
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm text-text-secondary">
          <Link to="/home" className="flex items-center hover:text-text-primary"><Home className="w-4 h-4 mr-2" /></Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/problems" className="mx-2 hover:text-text-primary">Problems</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-text-primary font-semibold ml-2">{problemTitle}</span>
        </div>
      </div>

      {/* Right side controls */}
      <div className="flex items-center space-x-4">
        <Dropdown options={THEMES} selected={theme} onSelect={setTheme} label="Theme" icon={theme.includes('light') ? Sun : Moon} />
        <Dropdown options={LANGUAGES} selected={language} onSelect={setLanguage} label="Language" icon={Languages} />
      </div>
    </header>
  );
};

export default Header;