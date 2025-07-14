import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/authService'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer' 

const Homepage = () => {
  const { user } = useAuth()
  const [totalUsers, setTotalUsers] = useState(0)
  const [loading, setLoading] = useState(true)

  // Fetch total users count
  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const data = await authService.getUserCount()
        if (data.success) {
          setTotalUsers(data.count)
        } else {
          throw new Error(data.message || 'Failed to fetch user count')
        }
      } catch (error) {
        console.error('Error fetching user count:', error)
        // Fallback to a default number or keep it at 0
        setTotalUsers(221) // Example fallback
      } finally {
        setLoading(false)
      }
    }

    fetchUserCount()
  }, [])

  // Animated counter effect
  const [displayCount, setDisplayCount] = useState(0)
  useEffect(() => {
    if (totalUsers > 0) {
      let start = 0
      const increment = totalUsers / 100
      const timer = setInterval(() => {
        start += increment
        if (start >= totalUsers) {
          setDisplayCount(totalUsers)
          clearInterval(timer)
        } else {
          setDisplayCount(Math.floor(start))
        }
      }, 20)
      return () => clearInterval(timer)
    }
  }, [totalUsers])

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center text-white max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="mb-16">
            <h1 className="text-6xl md:text-8xl font-bold mb-8 bg-white bg-clip-text text-transparent">
              Code
            <span className='text-[#EC4899]'>Hub</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Sharpen your coding skills with algorithmic problems and compete with others in our interactive coding platform
            </p>
            
            {/* User Count Display */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-3 bg-slate-900/60 backdrop-blur-sm border border-slate-700 rounded-full px-6 py-3">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full border-2 border-slate-900"></div>
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full border-2 border-slate-900"></div>
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full border-2 border-slate-900"></div>
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-full border-2 border-slate-900"></div>
                </div>
                <span className="text-gray-300">
                  Join {loading ? '...' : displayCount.toLocaleString()} developers already coding
                </span>
              </div>
            </div>
          </div>

          {/* Authentication Section */}
          {!user && (
            <div className="mb-20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                {/* Register Card */}
                <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 hover:border-pink-400/50 transition-all duration-300 group">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">New to Coding?</h3>
                    <p className="text-gray-400 mb-6">Start your journey</p>
                  </div>
                  <Link
                    to="/register"
                    className="inline-block w-full bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-green-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Get Started
                  </Link>
                </div>

                {/* Login Card */}
                <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 hover:border-pink-400/50 transition-all duration-300 group">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Ready to Code?</h3>
                    <p className="text-gray-400 mb-6">Welcome back! Be Better</p>
                  </div>
                  <Link
                    to="/login"
                    className="inline-block w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </div>
          )}

         

          {/* Compiler Section */}
          <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800 rounded-3xl p-12 max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                Online Compiler
              </h2>
              <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                Use our advanced online compiler with auto-completion and syntax highlighting to test your code instantly without the hassle of downloading tons of compilers.
              </p>
            </div>
            
            <Link 
              to="/compiler" 
              className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-red-600 text-white px-12 py-5 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-orange-500/25"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M19 10a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Try Compiler Now
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

          {/* Features Section */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Quality Problems</h3>
              <p className="text-gray-400">Curated algorithmic challenges for all skill levels</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Community</h3>
              <p className="text-gray-400">Connect with fellow developers and learn together</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-violet-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Real-time Coding</h3>
              <p className="text-gray-400">Test and debug your solutions instantly</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Homepage