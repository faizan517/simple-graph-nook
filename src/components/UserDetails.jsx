
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, 
  Phone, 
  MapPin, 
  Calendar, 
  Clock, 
  Briefcase, 
  BarChart, 
  Mail,
  User
} from 'lucide-react';

const UserDetails = () => {
  const { id } = useParams();
  const { getUserById } = useAuth();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading delay
    setTimeout(() => {
      const userData = getUserById(parseInt(id));
      if (userData) {
        setUser(userData);
      }
      setIsLoading(false);
    }, 800);
  }, [id, getUserById]);

  const handleBack = () => {
    navigate('/users');
  };

  if (isLoading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
          <p className="mt-4 text-muted-foreground">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">User not found</h2>
          <p className="text-muted-foreground mb-6">The requested user does not exist.</p>
          <button 
            onClick={handleBack}
            className="inline-flex items-center px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium transition-colors hover:bg-primary/90"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Back button */}
      <button 
        onClick={handleBack}
        className="mb-6 inline-flex items-center px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium transition-colors hover:bg-secondary/80"
      >
        <ArrowLeft className="mr-1.5 h-4 w-4" />
        Back to Users
      </button>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Profile Card */}
        <div className="glass-card rounded-xl p-6 shadow-sm h-fit lg:sticky lg:top-24">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="h-24 w-24 rounded-full object-cover border-4 border-background shadow-sm"
              />
              <span className={`absolute bottom-0 right-0 h-5 w-5 rounded-full border-2 border-background ${
                user.status === 'Active' ? 'bg-green-500' : 
                user.status === 'Away' ? 'bg-amber-500' : 
                'bg-gray-400'
              }`}></span>
            </div>
            
            <h2 className="mt-4 text-xl font-semibold">{user.name}</h2>
            <p className="text-muted-foreground">{user.role}</p>
            
            <div className="mt-4 flex items-center justify-center space-x-2 text-sm">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
                {user.department}
              </span>
              <span className={`px-3 py-1 rounded-full ${
                user.status === 'Active'
                  ? 'bg-green-100 text-green-800'
                  : user.status === 'Away'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {user.status}
              </span>
            </div>
            
            <div className="w-full mt-6 pt-6 border-t border-border">
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-muted-foreground mr-3" />
                  <p className="text-sm">{user.email}</p>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-muted-foreground mr-3" />
                  <p className="text-sm">{user.contact.phone}</p>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 text-muted-foreground mr-3 mt-0.5" />
                  <p className="text-sm">{user.contact.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* User Details Section */}
        <div className="lg:col-span-2 space-y-8">
          {/* General Information */}
          <div className="glass-card rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">General Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center text-muted-foreground text-sm">
                  <User className="h-4 w-4 mr-2" />
                  <span>User ID</span>
                </div>
                <p className="font-medium">{user.id}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center text-muted-foreground text-sm">
                  <Briefcase className="h-4 w-4 mr-2" />
                  <span>Department</span>
                </div>
                <p className="font-medium">{user.department}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center text-muted-foreground text-sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Joined Date</span>
                </div>
                <p className="font-medium">{user.joinDate}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center text-muted-foreground text-sm">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Last Active</span>
                </div>
                <p className="font-medium">{user.lastActive}</p>
              </div>
            </div>
          </div>
          
          {/* Performance Section */}
          <div className="glass-card rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Performance</h3>
            
            <div className="space-y-4">
              <div className="w-full bg-secondary rounded-full h-4">
                <div
                  className="bg-primary h-4 rounded-full"
                  style={{ width: `${user.performance}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Overall Score</span>
                <span className="font-medium">{user.performance}%</span>
              </div>
            </div>
          </div>
          
          {/* Projects */}
          <div className="glass-card rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Projects</h3>
            
            <div className="space-y-4">
              {user.projects && user.projects.length > 0 ? (
                user.projects.map((project, index) => (
                  <div 
                    key={index}
                    className="p-4 rounded-lg border border-border hover:border-primary/30 hover:bg-primary/5 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3">
                          <BarChart className="h-4 w-4" />
                        </div>
                        <span className="font-medium">{project}</span>
                      </div>
                      {/* We could add project details here */}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No projects assigned.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
