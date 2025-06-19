import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import HomeNav from '../components/HomeNav'

const Homepage = () => {
  const { user } = useAuth()

  return (
    <>
    <HomeNav />
    <div className="min-h-160 flex items-center justify-center ">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-6">CodeHub</h1>
        <p className="text-xl mb-8 text-gray-300">
          Sharpen your coding skills with algorithmic problems and compete with others
        </p>
        
        {!user && (
          <div className="space-x-4 flex  items-center justify-center gap-30">
            <div className='flex flex-col items-center space-x-2'>
            <p className='text-gray-300'>Beginner?</p>
            <Link 
              to="/register" 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Register
            </Link>
              </div>
            <div className='flex flex-col items-center space-x-2'>
            <p className='text-gray-300'>Addicted?</p>
            <Link 
              to="/login" 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign In
            </Link>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  )
}

export default Homepage