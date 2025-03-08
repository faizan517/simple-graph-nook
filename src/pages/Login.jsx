
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/LoginForm';

const Login = () => {
  const { isAuthenticated } = useAuth();

  // Add subtle background animation
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      
      if (document.getElementById('gradient-bg')) {
        document.getElementById('gradient-bg').style.transform = `translate(${x * 20}px, ${y * 20}px)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          id="gradient-bg"
          className="absolute inset-0 transition-transform duration-300 ease-out"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(var(--primary-rgb), 0.08) 0%, rgba(var(--primary-rgb), 0.03) 25%, rgba(var(--primary-rgb), 0.01) 50%, rgba(var(--primary-rgb), 0) 100%)',
            width: '150%',
            height: '150%',
            top: '-25%',
            left: '-25%',
          }}
        ></div>
      </div>

      {/* Login container */}
      <div className="w-full max-w-md z-10">
        <LoginForm />
      </div>
      
      {/* Footer */}
      <div className="absolute bottom-6 text-center text-xs text-muted-foreground">
        <p>© 2023 EleganceOS. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Login;
