import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth-select', {
        state: { redirectTo: location.pathname },
      });
    }
  }, [user, loading, navigate, location.pathname]);

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        Checking authentication...
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        Redirecting to authentication...
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
