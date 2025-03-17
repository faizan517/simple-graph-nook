
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

// Create a context
const AuthContext = createContext(null);

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quotationData, setQuotationData] = useState(null);
  const [quotationLoading, setQuotationLoading] = useState(false);
  const navigate = useNavigate();

  // Mock user for login
  const mockUsers = [
    {
      id: 1,
      email: 'admin@example.com',
      password: 'password',
      name: 'Admin User',
      role: 'Administrator',
    }
  ];

  // Check for existing session
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      // Fetch quotation data after user is loaded
      fetchQuotationData();
    }
    setLoading(false);
  }, []);

  // Fetch quotation data
  const fetchQuotationData = async () => {
    setQuotationLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/quotations/all');
      const result = await response.json();
      
      if (result.success) {
        setQuotationData(result.data);
        return result.data;
      } else {
        toast.error("Failed to fetch quotation data");
        console.error("API error:", result);
        return null;
      }
    } catch (error) {
      console.error("Error fetching quotation data:", error);
      toast.error("Error connecting to the API");
      return null;
    } finally {
      setQuotationLoading(false);
    }
  };

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
          
          // Fetch quotation data after successful login
          fetchQuotationData()
            .then(() => {
              toast.success("Login successful");
              resolve(userWithoutPassword);
              navigate('/dashboard');
            })
            .catch(err => {
              console.error("Error fetching initial data:", err);
              toast.success("Login successful, but couldn't load initial data");
              resolve(userWithoutPassword);
              navigate('/dashboard');
            });
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
    setQuotationData(null);
    localStorage.removeItem('user');
    toast.info("You have been logged out");
    navigate('/login');
  };

  // Get all users with quotations
  const getAllUsers = async () => {
    if (!quotationData) {
      const data = await fetchQuotationData();
      if (!data) return [];
      
      // Transform data to match the expected format
      return data.users.map(user => ({
        id: user.user_details.id,
        name: `${user.user_details.first_name} ${user.user_details.last_name}`,
        email: user.user_details.work_email,
        department: user.user_details.company_name,
        status: user.total_quotations > 0 ? 'Active' : 'Pending',
        quotations: user.quotations,
        contactInfo: {
          mobile: user.user_details.mobile_number,
          email: user.user_details.work_email
        },
        createdAt: new Date(user.user_details.created_at).toLocaleDateString()
      }));
    }
    
    // Return cached data
    return quotationData.users.map(user => ({
      id: user.user_details.id,
      name: `${user.user_details.first_name} ${user.user_details.last_name}`,
      email: user.user_details.work_email,
      department: user.user_details.company_name,
      status: user.total_quotations > 0 ? 'Active' : 'Pending',
      quotations: user.quotations,
      contactInfo: {
        mobile: user.user_details.mobile_number,
        email: user.user_details.work_email
      },
      createdAt: new Date(user.user_details.created_at).toLocaleDateString()
    }));
  };

  // Get user by ID
  const getUserById = async (id) => {
    const numericId = parseInt(id);
    
    if (!quotationData) {
      await fetchQuotationData();
    }
    
    if (!quotationData) return null;
    
    const userData = quotationData.users.find(u => u.user_details.id === numericId);
    
    if (!userData) return null;
    
    return {
      id: userData.user_details.id,
      name: `${userData.user_details.first_name} ${userData.user_details.last_name}`,
      email: userData.user_details.work_email,
      department: userData.user_details.company_name,
      status: userData.total_quotations > 0 ? 'Active' : 'Pending',
      quotations: userData.quotations,
      contactInfo: {
        mobile: userData.user_details.mobile_number,
        email: userData.user_details.work_email
      },
      createdAt: new Date(userData.user_details.created_at).toLocaleDateString()
    };
  };

  // Context value
  const value = {
    user,
    loading,
    login,
    logout,
    getAllUsers,
    getUserById,
    quotationLoading,
    fetchQuotationData,
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
