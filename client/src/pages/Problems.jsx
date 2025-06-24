import React from 'react'
import Navbar from '../components/Navbar'
import { Link } from 'react-router-dom'

const Problems = () => {
  return (
    <div>
    <Navbar />
    <div className="min-h-160 flex items-center justify-center ">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-6">Problems</h1>
      </div>
    </div>
    </div>
  )
}

export default Problems