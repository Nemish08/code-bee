import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import CustomUserMenu from './UserButton';
import syncUser from '../lib/uerSync';
import { useAuth, useUser } from '@clerk/clerk-react';
import {useHeader} from '../context/HeaderContext';



function Navbar_() {
  const { flag} = useHeader();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const { getToken } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    const sync = async () => {
      if (user?.id) {
        const token = await getToken();
        if (token) await syncUser(token,user);
      }
    };
    sync();
  }, [user?.id]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home' },
    { name: 'Problems' },
    {name:'Contest'}
  ];

  const handleClick = (item) => {
    const path = item.name ? String(item.name).toLowerCase() : '/';
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const logoSrc = 'code_bee.png';

  return (<>
    {flag && 
    <header className="fixed top-0 left-0 w-full z-10 flex justify-center py-2 md:py-4">
      <div
        className={`w-[95%] md:w-[90%] lg:w-[85%] max-w-7xl mx-auto transform transition-all duration-500 ease-in-out flex flex-col justify-center items-center ${isScrolled ? 'scale-[0.85] md:scale-75 -translate-y-2' : 'scale-100 translate-y-0'}`}
      >
        <nav
          className={`flex items-center justify-between h-15 px-0 sm:px-8 rounded-xl transition-all duration-500 ease-in-out w-[90%] ${isScrolled ? 'bg-white/80 backdrop-blur-xl shadow-2xl' : 'shadow-lg'}`}
        >
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleClick({})}>
            <img src="/code_bee.png" alt="CodeBee Logo" className="h-10 w-10 object-contain" />
            <span className="text-xl font-bold text-gray-800 hidden sm:inline">CodeBee</span>
          </div>

          {/* Desktop Navigation */}
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

          {/* Right: Desktop Auth */}
          <div className="hidden md:block">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-black font-bold hover:opacity-75 transition-opacity duration-300 text-base cursor-pointer">
                  Login
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <CustomUserMenu />
            </SignedIn>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 -mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/30 z-40 md:hidden transition-opacity duration-300 ease-in-out ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-4/5 max-w-xs bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-5 border-b">
            <div className="flex items-center gap-2" onClick={() => handleClick({})}>
              <img src={logoSrc} alt="CodeBee Logo" className="h-8 w-8 object-contain" />
              <span className="text-lg font-bold text-gray-800">CodeBee</span>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 -mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mobile Nav */}
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
            <SignedOut>
              <SignInButton mode="modal">
                <button className="w-full text-left py-3 px-3 text-lg text-black hover:bg-gray-100 rounded-md font-bold">
                  Login
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <div className="px-3 py-2">
                <CustomUserMenu />
              </div>
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
    }
    </>
  );
}

export default Navbar_;
