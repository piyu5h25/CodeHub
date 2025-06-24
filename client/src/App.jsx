import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Homepage from './pages/Homepage'
import Login from './pages/Login'
import Register from './pages/Register'
import Background from './pages/Background'
import Problems from './pages/Problems' 

const App = () => {
  return (
    
        <div className="relative min-h-screen">
          <Background />
          <div className="relative z-10">
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/problems" element={<Problems />} />
            </Routes>
          </div>
        </div>
      
  );
}

export default App