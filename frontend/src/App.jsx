import React from 'react';
import LandingPage from './pages/landingPage/LandingPage';
import { BrowserRouter as Router, Routes, Route, useLocation, matchPath } from 'react-router-dom';
import Navbar_ from './components_/Navbar';
import Problems from './pages/problems/Problems';
import Page from './pages/problems/Page';
import CodingPage from './pages/codingPage/CodingPage';
import UserProfileDashboard from './pages/user/UserPage';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/react-router';
import { SignIn, SignUp } from '@clerk/clerk-react';
import Competitions from './pages/contest/Competitions';
import CreateContest from './pages/contest/CreateContest';
import ContestLobby from './pages/contest/ContestLobby';
import ContestResultsPage from './pages/contest/ContestResultsPage';
// ✅ Protected route wrapper
const ProtectedRoute = ({ children }) => (
  <>
    <SignedIn>{children}</SignedIn>
    <SignedOut>
      <RedirectToSignIn />
    </SignedOut>
  </>
);

// ✅ App component
function App() {
  const location = useLocation();

  // Routes where header should be hidden
  const noHeaderRoutes = ['/sign-in', '/sign-up'];

  const shouldHideHeader =
    noHeaderRoutes.includes(location.pathname) ||
    matchPath('/problems/:problemId', location.pathname);

  return (
    <>
      {!shouldHideHeader && <Navbar_ />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sign-in/*" element={<SignIn routing="path" path="/sign-in" />} />
        <Route path="/sign-up/*" element={<SignUp routing="path" path="/sign-up" />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path="/problems" element={<ProtectedRoute><Page /></ProtectedRoute>} />
        <Route path="/problems/:problemId" element={<ProtectedRoute><CodingPage /></ProtectedRoute>} />
        <Route path="/user" element={<ProtectedRoute><UserProfileDashboard /></ProtectedRoute>} />
        <Route path="/contest" element={<ProtectedRoute><Competitions/></ProtectedRoute>}/>
        <Route path="create-contest" element={<ProtectedRoute><CreateContest/></ProtectedRoute>}/>
        <Route path="/contest/:contestId" element={<ProtectedRoute><ContestLobby/></ProtectedRoute>}/>
        {/* <Route path="/contest/:contestId" element={<ProtectedRoute><ContestLobby/></ProtectedRoute>}/> */}
        <Route path="/contest/results/:contestId" element={<ProtectedRoute><ContestResultsPage/></ProtectedRoute>}/>
      </Routes>
    </>
  );
}

export default App;
