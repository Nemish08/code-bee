// src/components/Header.jsx
import { Home, ChevronRight, Bookmark, Share2, Sun, Moon, Languages, CircleHelp } from 'lucide-react';

const Header = () => {
  return (
    <div className="bg-dark-header text-text-primary px-4 py-2 flex justify-between items-center border-b border-dark-border w-[90%]">
      <div className="flex flex-col">
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm text-text-secondary">
          <Home className="w-4 h-4 mr-2" />
          <ChevronRight className="w-4 h-4" />
          <span className="mx-2">Problems</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-text-primary font-semibold ml-2">Check Even or Odd</span>
        </div>
        {/* Problem Meta */}
        <div className="flex items-center text-xs text-text-secondary mt-1 space-x-4">
          <span>Updated 6/8/2025</span>
          <span>20 Submissions</span>
          <span>0% Success Rate</span>
        </div>
      </div>

      {/* Right side controls */}
      <div className="flex items-center space-x-4">
        <button className="p-1.5 hover:bg-dark-panel rounded">
          <Bookmark className="w-5 h-5" />
        </button>
        <button className="p-1.5 hover:bg-dark-panel rounded">
          <Share2 className="w-5 h-5" />
        </button>
        
        {/* Theme and Language selectors */}
        <div className="flex items-center bg-dark-panel border border-dark-border rounded-md px-3 py-1.5 text-sm">
          <span>VS Dark</span>
          <Moon className="w-4 h-4 ml-2" />
        </div>
        <div className="flex items-center bg-dark-panel border border-dark-border rounded-md px-3 py-1.5 text-sm">
          <Languages className="w-4 h-4 mr-2" />
          <span>JavaScript</span>
        </div>
      </div>
    </div>
  );
};

export default Header;  