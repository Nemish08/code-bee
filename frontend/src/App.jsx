import React from 'react'
import LandingPage from './pages/landingPage/LandingPage'
import {BrowserRouter as Router, Routes,Route} from "react-router-dom"
import Navbar_ from './components_/Navbar'
import Problems from './pages/problems/Problems'
import Page from './pages/problems/Page'
import CodingPage from './pages/codingPage/CodingPage'
import UserProfileDashboard from './pages/user/UserPage'

function App() {
  return (

    
    // <div>
    //   <LandingPage/>
  
    //             {/* <div className="absolute w-[300px] top-20 left-20 h-[300px] bg-gradient-to-r from-red-200 via-orange-400 to-yello-400  rounded-2xl blur-xl opacity-60 animate-pulse custom-shape" /> */}
    
    
    // </div>
    <Router>
    <Navbar_/>
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/home" element={<LandingPage/>}/>
        <Route path="/problems" element={<Page/>}/>
        <Route path="/problems/:id" element={<CodingPage/>}/>
        <Route path="/user" element={<UserProfileDashboard/>}/>
      </Routes>
   
    </Router>
  )
}

export default App