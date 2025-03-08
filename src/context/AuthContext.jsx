
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

// Create a context
const AuthContext = createContext(null);

// Mock user data
const mockUsers = [
  {
    id: 1,
    email: 'admin@example.com',
    password: 'password',
    name: 'Admin User',
    role: 'Administrator',
    avatar: 'https://i.pravatar.cc/150?img=1',
    department: 'Management',
    joinDate: '2021-03-15',
    status: 'Active',
    lastActive: '2023-06-22',
    projects: ['Dashboard Redesign', 'Mobile App'],
    performance: 95,
    contact: {
      phone: '+1 (555) 123-4567',
      address: '123 Main St, San Francisco, CA',
    },
  },
  {
    id: 2,
    email: 'user@example.com',
    password: 'password',
    name: 'John Doe',
    role: 'Developer',
    avatar: 'https://i.pravatar.cc/150?img=3',
    department: 'Engineering',
    joinDate: '2022-01-10',
    status: 'Active',
    lastActive: '2023-06-21',
    projects: ['API Integration', 'Bug Fixes'],
    performance: 88,
    contact: {
      phone: '+1 (555) 987-6543',
      address: '456 Oak St, New York, NY',
    },
  },
  {
    id: 3,
    email: 'jane@example.com',
    password: 'password',
    name: 'Jane Smith',
    role: 'Designer',
    avatar: 'https://i.pravatar.cc/150?img=5',
    department: 'Design',
    joinDate: '2021-08-22',
    status: 'Away',
    lastActive: '2023-06-18',
    projects: ['UI Redesign', 'Brand Guidelines'],
    performance: 92,
    contact: {
      phone: '+1 (555) 234-5678',
      address: '789 Pine St, Seattle, WA',
    },
  },
  {
    id: 4,
    email: 'mike@example.com',
    password: 'password',
    name: 'Mike Johnson',
    role: 'QA Engineer',
    avatar: 'https://i.pravatar.cc/150?img=8',
    department: 'Quality Assurance',
    joinDate: '2022-03-05',
    status: 'Active',
    lastActive: '2023-06-22',
    projects: ['Testing Framework', 'Automation Tests'],
    performance: 84,
    contact: {
      phone: '+1 (555) 345-6789',
      address: '101 Elm St, Chicago, IL',
    },
  },
  {
    id: 5,
    email: 'sarah@example.com',
    password: 'password',
    name: 'Sarah Williams',
    role: 'Product Manager',
    avatar: 'https://i.pravatar.cc/150?img=10',
    department: 'Product',
    joinDate: '2021-05-18',
    status: 'Inactive',
    lastActive: '2023-06-15',
    projects: ['Product Roadmap', 'Market Research'],
    performance: 90,
    contact: {
      phone: '+1 (555) 456-7890',
      address: '202 Cedar St, Austin, TX',
    },
  },
];

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing session
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      // Simulate API call delay
      setTimeout(() => {
        const foundUser = mockUsers.find(u => u.email === email && u.password === password);
        
        if (foundUser) {
          // Remove password from stored user data
          const { password, ...userWithoutPassword } = foundUser;
          setUser(userWithoutPassword);
          localStorage.setItem('user', JSON.stringify(userWithoutPassword));
          toast.success("Login successful");
          resolve(userWithoutPassword);
          navigate('/dashboard');
        } else {
          toast.error("Invalid email or password");
          reject(new Error('Invalid email or password'));
        }
      }, 800);
    });
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.info("You have been logged out");
    navigate('/login');
  };

  // Get all users function (for admin purposes)
  const getAllUsers = () => {
    return mockUsers.map(({ password, ...userWithoutPassword }) => userWithoutPassword);
  };

  // Get user by ID
  const getUserById = (id) => {
    const user = mockUsers.find(u => u.id === parseInt(id));
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  };

  // Context value
  const value = {
    user,
    loading,
    login,
    logout,
    getAllUsers,
    getUserById,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
