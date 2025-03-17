
import React, { useState, useEffect } from 'react';
import { Users, ClipboardList, UserCheck, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

const Dashboard = () => {
  const { getAllUsers, quotationLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [leadsData, setLeadsData] = useState({
    totalLeads: 0,
    activeLeads: 0,
    recentLeads: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const users = await getAllUsers();
        
        if (users && users.length > 0) {
          // Calculate lead metrics
          const totalLeads = users.length;
          const activeLeads = users.filter(user => user.status === 'Active').length;
          
          // Consider users created in last 7 days as recent
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          
          const recentLeads = users.filter(user => {
            const createdDate = new Date(user.createdAt);
            return createdDate >= sevenDaysAgo;
          }).length;

          setLeadsData({
            totalLeads,
            activeLeads,
            recentLeads
          });
        } else {
          console.log("No users data available or empty array returned");
          toast.error("Could not load dashboard data");
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        toast.error("Error loading dashboard data");
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, [getAllUsers]);

  const handleViewAllLeads = () => {
    navigate('/users');
  };

  // Stats cards data
  const stats = [
    {
      title: 'Total Leads',
      value: leadsData.totalLeads,
      description: 'All leads in the system',
      icon: <Users className="h-5 w-5" />,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Active Leads',
      value: leadsData.activeLeads,
      description: 'Currently active leads',
      icon: <UserCheck className="h-5 w-5" />,
      color: 'bg-green-50 text-green-600',
    },
    {
      title: 'Recent Leads',
      value: leadsData.recentLeads,
      description: 'New leads in last 7 days',
      icon: <Clock className="h-5 w-5" />,
      color: 'bg-purple-50 text-purple-600',
    },
    {
      title: 'All Quotations',
      description: 'View all submitted plans',
      icon: <ClipboardList className="h-5 w-5" />,
      color: 'bg-amber-50 text-amber-600',
      isAction: true,
      action: handleViewAllLeads
    },
  ];

  if (isLoading || quotationLoading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`glass-card rounded-xl p-6 hover-scale shadow-sm ${stat.isAction ? 'cursor-pointer' : ''}`}
            onClick={stat.isAction ? stat.action : undefined}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                {stat.value !== undefined ? (
                  <h3 className="text-2xl font-semibold mt-1">{stat.value}</h3>
                ) : (
                  <h3 className="text-lg font-medium mt-1">View Details</h3>
                )}
                <div className="mt-1 text-xs font-medium text-muted-foreground">
                  <span>{stat.description}</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Leads Section */}
      <div className="glass-card rounded-xl p-6 shadow-sm">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Recent Lead Activity</h2>
            <p className="text-muted-foreground text-sm">Latest form submissions and plan selections</p>
          </div>
          <button 
            onClick={handleViewAllLeads}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
          >
            View All
          </button>
        </div>
        
        <div className="space-y-4">
          {leadsData.totalLeads > 0 ? (
            <p className="text-center py-4">
              You have <span className="font-bold">{leadsData.totalLeads}</span> leads in total.
              Visit the <button onClick={handleViewAllLeads} className="text-primary font-medium">Leads page</button> to see details.
            </p>
          ) : (
            <p className="text-center py-4 text-muted-foreground">No lead data available yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
