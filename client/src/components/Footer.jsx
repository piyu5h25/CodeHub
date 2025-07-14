import React from 'react'

const Footer = () => {
  return (
    <footer className="relative mt-20 border-t border-slate-800/50 bg-slate-950/80 backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-500/5 to-transparent"></div>
      
      <div className="relative mx-auto max-w-7xl px-6 py-8">
        {/* Social Links */}
        <div className="flex flex-col items-center space-y-4">
          <h3 className="text-lg font-semibold text-white mb-2">
            Let's Connect
          </h3>
          
          <div className="flex space-x-8">
            <a
              href="https://github.com/piyu5h25"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-pink-400 transition-colors duration-200 text-sm font-medium"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/piyush-trivedi-84569b196/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-pink-400 transition-colors duration-200 text-sm font-medium"
            >
              LinkedIn
            </a>
            <a
              href="https://www.instagram.com/piyush_tvd/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-pink-400 transition-colors duration-200 text-sm font-medium"
            >
              Instagram
            </a>
            <a
              href="mailto:piyush.tvd@gmail.com"
              onClick={(e) => {
                if (!window.confirm("Open email client to send to piyush.tvd@gmail.com?")) {
                  e.preventDefault();
                  navigator.clipboard.writeText("piyush.tvd@gmail.com");
                  alert("Email address copied to clipboard!");
                }
              }}
              className="text-slate-400 hover:text-pink-400 transition-colors duration-200 text-sm font-medium"
            >
              Email
            </a>
          </div>
          
          <div className="flex flex-col items-center space-y-2">
            <p className="text-slate-500 text-sm">
              Made with <span className="text-pink-400">♥</span> in Prayagraj
            </p>
            <p className="text-slate-500 text-sm">
              © 2025 All rights reserved.
            </p>
          </div>
        </div>
      </div>
      
      {/* Gradient accent */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-pink-500/50 to-transparent"></div>
    </footer>
  )
}

export default Footer