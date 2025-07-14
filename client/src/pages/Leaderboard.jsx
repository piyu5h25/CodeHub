import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Background from '../pages/Background';
import Footer from '../components/Footer';

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/leaderboard`, {
                    credentials: 'include',
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch leaderboard');
                }
                
                const data = await response.json();
                setLeaderboard(data.leaderboard || []);
                setLoading(false);
            } catch (err) {
                setError('Failed to load leaderboard');
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen">
                <Background />
                <Navbar />
                <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
                    <div className="text-white text-lg">Loading...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen">
                <Background />
                <Navbar />
                <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
                    <div className="text-red-400 text-lg">{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <Background />
            <Navbar />
            
            <div className="max-w-2xl mx-auto py-12 px-4">
                <h1 className="text-4xl font-bold text-white mb-8 text-center">
                    Leaderboard
                </h1>

                <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-6">
                    {leaderboard.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-slate-400 text-lg">No data available</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {leaderboard.map((user, index) => (
                                <div
                                    key={user._id}
                                    className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30 border border-slate-700/30 hover:bg-slate-800/50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="text-slate-400 font-medium w-8">
                                            {index + 1}
                                        </span>
                                        <span className="text-white font-medium">
                                            {user.firstName} {user.lastName}
                                        </span>
                                    </div>
                                    <span className="text-purple-400 font-semibold">
                                        {user.totalScore}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Leaderboard;