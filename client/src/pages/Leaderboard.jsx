import React from 'react'

const Leaderboard = () => {
  return (
    <div>
        <Navbar />
        <Background />
        <div className="container mx-auto py-10 px-4 flex flex-col items-center">
            <h1 className="text-4xl font-bold mb-6 text-white">Leaderboard</h1>
        </div>
    </div>
  )
}

export default Leaderboard