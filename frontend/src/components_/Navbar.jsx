import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function Navbar_() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Effect to handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      // Set isScrolled to true if user scrolls down more than 10px
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    // Cleanup function to remove the event listener
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: "Home" },
    { name: "Problems" },
  ];

  // Navigation handler
  const handleClick = (item) => {
    // A special case for the logo click to go to the home page
    const path = item.name ? String(item.name).toLowerCase() : '/';
    navigate(path);
    setIsMobileMenuOpen(false); // Close mobile menu on navigation
  };
  
  // Base64 encoded logo from the provided crop
  const logoSrc = "code_bee.png";

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-center py-2 md:py-4">
      <div
        className={`
          w-[95%] md:w-[90%] lg:w-[85%] max-w-7xl
          mx-auto
          transform
          transition-all duration-500 ease-in-out
          flex  flex-col justify-center items-center
          ${isScrolled ? 'scale-[0.85] md:scale-75 -translate-y-2' : 'scale-100 translate-y-0'}
        `}
      >
        <nav
          className={`
            flex items-center justify-between
            h-15 px-0 sm:px-8 rounded-xl 
            transition-all duration-500 ease-in-out w-[90%]
            ${isScrolled ? 'bg-white/80 backdrop-blur-xl shadow-2xl' : ' shadow-lg'}
          `}
        >
          {/* Left: Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleClick({})}>
            <img 
              src={logoSrc}
              alt="CodeBee Logo" 
              className="h-10 w-10 object-contain"/>
            <span className="text-xl font-bold text-gray-800 hidden sm:inline">CodeBee</span>
          </div>

          {/* Middle: Nav Links (Desktop) */}
          <div className="hidden md:flex items-center gap-10">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleClick(item)}
                className="text-gray-500 hover:text-black font-medium transition-colors duration-300"
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Right: Login (Desktop) */}
          <div className="hidden md:block">
            <button
              onClick={() => handleClick({name: 'login'})}
              className="text-black font-bold hover:opacity-75 transition-opacity duration-300 text-base"
            >
              Login
            </button>
          </div>

          {/* Right: Mobile Menu Toggle Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 -mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </nav>
      </div>

      {/* --- Mobile Menu --- */}
      {/* Overlay */}
      <div
        className={`
            fixed inset-0 bg-black/30 z-40 md:hidden
            transition-opacity duration-300 ease-in-out
            ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        onClick={() => setIsMobileMenuOpen(false)}
      />
      {/* Panel */}
      <div
        className={`
            fixed top-0 right-0 h-full w-4/5 max-w-xs bg-white shadow-xl z-50
            transform transition-transform duration-300 ease-in-out md:hidden
            ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex justify-between items-center p-5 border-b">
            <div className="flex items-center gap-2" onClick={() => handleClick({})}>
              <img src={logoSrc} alt="CodeBee Logo" className="h-8 w-8 object-contain"/>
              <span className="text-lg font-bold text-gray-800">CodeBee</span>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 -mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu Links */}
          <div className="flex flex-col p-5 space-y-2">
            {navItems.map((item) => (
              <button
                key={`mobile-${item.name}`}
                onClick={() => handleClick(item)}
                className="w-full text-left py-3 px-3 text-lg text-gray-700 hover:bg-gray-100 rounded-md font-semibold"
              >
                {item.name}
              </button>
            ))}
            <button
              onClick={() => handleClick({name: 'login'})}
              className="w-full text-left py-3 px-3 text-lg text-black hover:bg-gray-100 rounded-md font-bold"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar_;