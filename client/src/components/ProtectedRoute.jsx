import React, { useEffect } from 'react'
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';


    const ProtectedRoute = ({ children }) => {
        const { user } = useAuth();
        const navigate = useNavigate();
        const location = useLocation();
      
    console.log('ProtectedRoute - user:', user, 'location:', location.pathname); // Debug log

    useEffect(() => {
        if (!user) {
        console.log('No user, redirecting to auth-select'); // Debug log
        navigate('/auth-select', { 
            state: { redirectTo: location.pathname } 
        });
        }
    }, [user, navigate, location.pathname]);

    if (!user) {
        return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            Redirecting to authentication...
        </div>
        );
    }

    return children;
    };
    

export default ProtectedRoute