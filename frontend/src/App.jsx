import React from 'react'
import LandingPage from './pages/landingPage/LandingPage'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar_ from './components_/Navbar'
import Problems from './pages/problems/Problems'
import Page from './pages/problems/Page'
import CodingPage from './pages/codingPage/CodingPage'
import UserProfileDashboard from './pages/user/UserPage'
import { ClerkProvider, SignedIn, SignedOut, SignInButton, RedirectToSignIn } from '@clerk/react-router'
import { SignIn, SignUp, UserButton, useUser } from '@clerk/clerk-react';

const ProtectedRoute = ({ children }) => {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut><RedirectToSignIn /></SignedOut>
    </>
  );
};



function App() {
  return (

    <>
      <Navbar_ />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sign-in/*" element={<SignIn routing="path" path="/sign-in" />} />
        <Route path="/sign-up/*" element={<SignUp routing="path" path="/sign-up" />} />
        <Route path="/home" element={<LandingPage />} />
        
        <Route path="/problems" element={<ProtectedRoute><Page/></ProtectedRoute>} />
        <Route path="/problems/:id" element={<ProtectedRoute><CodingPage/></ProtectedRoute>} />
        <Route path="/user" element={<ProtectedRoute><UserProfileDashboard/></ProtectedRoute>}/>

      </Routes>

    </>
  )
}

export default App