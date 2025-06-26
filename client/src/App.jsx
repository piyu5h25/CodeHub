import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Homepage from './pages/Homepage'
import Login from './pages/Login'
import Register from './pages/Register'
import Background from './pages/Background'
import Problems from './pages/Problems' 
import ProblemDetail from './pages/ProblemDetail'
import Compiler from './pages/Compiler'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'

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
              <Route path="/problems/:id" element={<ProblemDetail />} />
              <Route path="/compiler" element={<Compiler />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
            </Routes>
          </div>
        </div>
      
  );
}

export default App