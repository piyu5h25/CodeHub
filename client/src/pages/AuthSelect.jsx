import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Background from './Background';

const AuthSelect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.redirectTo;
  console.log('AuthSelect - redirectTo:', redirectTo);

  return (
    <div className='min-h-screen flex flex-col relative overflow-hidden'>
      <Background />
      <Navbar />
      
      {/* Main Content */}
      <div className='flex-1 flex items-center justify-center px-6 py-12'>
        <div className='w-full max-w-md relative'>
          {/* Glassmorphism Card */}
          <div className='backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden'>
            {/* Inner glow effect */}
            <div className='absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl'></div>
            
            {/* Content */}
            <div className='relative z-10'>
              {/* Header */}
              <div className='text-center mb-8'>
                <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500/20 to-purple-600/20 rounded-full mb-4 backdrop-blur-sm border border-white/10'>
                  <svg className='w-8 h-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                  </svg>
                </div>
                <h1 className='text-3xl font-bold text-white mb-2 tracking-tight'>
                  Welcome Back
                </h1>
                <p className='text-white/70 text-lg'>
                  Choose how you'd like to continue
                </p>
              </div>

              {/* Buttons */}
              <div className='space-y-4'>
                <button 
                  onClick={() => navigate('/login', { state: { redirectTo } })}
                  className='group w-full bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-600 hover:to-violet-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-pink-500/25 active:scale-[0.98] relative overflow-hidden'
                >
                  <div className='absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700'></div>
                  <span className='relative flex items-center justify-center space-x-2'>
                    <span>Sign In</span>
                    <svg className='w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1' />
                    </svg>
                  </span>
                </button>

                <button 
                  onClick={() => navigate('/register', { state: { redirectTo } })}
                  className='group w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/30 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-white/10 active:scale-[0.98] relative overflow-hidden'
                >
                  <div className='absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700'></div>
                  <span className='relative flex items-center justify-center space-x-2'>
                    <span>Create Account</span>
                    <svg className='w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z' />
                    </svg>
                  </span>
                </button>
              </div>

              {/* Divider */}
              <div className='relative my-8'>
                <div className='absolute inset-0 flex items-center'>
                  <div className='w-full border-t border-white/20'></div>
                </div>
                <div className='relative flex justify-center text-sm'>
                  <span className='px-4 bg-transparent text-white/60 font-medium'>
                    Secure & Fast Authentication
                  </span>
                </div>
              </div>

              {/* Feature highlights */}
              <div className='grid grid-cols-3 gap-4 text-center'>
                <div className='flex flex-col items-center space-y-2'>
                  <div className='w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10'>
                    <svg className='w-5 h-5 text-white/70' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                    </svg>
                  </div>
                  <span className='text-xs text-white/60 font-medium'>Secure</span>
                </div>
                <div className='flex flex-col items-center space-y-2'>
                  <div className='w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10'>
                    <svg className='w-5 h-5 text-white/70' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />
                    </svg>
                  </div>
                  <span className='text-xs text-white/60 font-medium'>Fast</span>
                </div>
                <div className='flex flex-col items-center space-y-2'>
                  <div className='w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10'>
                    <svg className='w-5 h-5 text-white/70' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                    </svg>
                  </div>
                  <span className='text-xs text-white/60 font-medium'>Reliable</span>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className='absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-pink-400/20 to-purple-600/20 rounded-full blur-xl'></div>
            <div className='absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-tr from-violet-400/20 to-pink-600/20 rounded-full blur-xl'></div>
          </div>

          {/* Floating particles effect */}
          <div className='absolute inset-0 pointer-events-none'>
            <div className='absolute top-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-pulse'></div>
            <div className='absolute top-3/4 right-1/4 w-1 h-1 bg-pink-400/50 rounded-full animate-ping'></div>
            <div className='absolute bottom-1/4 left-3/4 w-1.5 h-1.5 bg-violet-400/40 rounded-full animate-pulse delay-1000'></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthSelect;