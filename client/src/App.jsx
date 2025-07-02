import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Homepage from './pages/Homepage'
import Login from './pages/Login'
import Register from './pages/Register'
import Background from './pages/Background'
import Problems from './pages/Problems' 
import Compiler from './pages/Compiler'
import ProblemEditor from './pages/ProblemEditor'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import ErrorBoundary from './components/ErrorBoundary'
import ProtectedRoute from './components/ProtectedRoute'
import AuthSelect from './pages/AuthSelect'
import Leaderboard from './pages/Leaderboard'

const App = () => {
  return (
    <ErrorBoundary>
      <div className="relative min-h-screen">
        <Background />
        <div className="relative z-10">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auth-select" element={<AuthSelect />} />
            <Route path="/problems" element={
              <ProtectedRoute>

                <Problems />
              </ProtectedRoute>
              } />
            <Route path="/problems/:id" element={<ProblemEditor />} />
            <Route path="/compiler" element={
              <ProtectedRoute>

                <Compiler />
              </ProtectedRoute>
              } />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App