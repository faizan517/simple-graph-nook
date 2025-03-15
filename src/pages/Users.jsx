
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NavBar from '../components/NavBar';
import UserTable from '../components/UserTable';

const Users = () => {
  const { isAuthenticated, loading } = useAuth();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-12 w-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      
      <main className="container mx-auto px-4 sm:px-6 pt-24 pb-16 page-transition">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Lead Management</h1>
          <p className="text-muted-foreground mt-1">All submitted forms and insurance plans</p>
        </div>
        
        <UserTable />
      </main>
    </div>
  );
};

export default Users;
