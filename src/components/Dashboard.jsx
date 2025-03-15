
import React, { useState, useEffect } from 'react';
import { Users, ClipboardList, UserCheck, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { getAllUsers } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [leadsData, setLeadsData] = useState({
    totalLeads: 0,
    activeLeads: 0,
    recentLeads: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      const users = getAllUsers();
      
      // Calculate lead metrics
      const totalLeads = users.length;
      const activeLeads = users.filter(user => user.status === 'Active').length;
      const recentLeads = users.filter(user => {
        // Consider users active in last 7 days as recent
        const lastActiveDate = new Date(user.lastActive);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return lastActiveDate >= sevenDaysAgo;
      }).length;

      setLeadsData({
        totalLeads,
        activeLeads,
        recentLeads
      });
      
      setIsLoading(false);
    }, 1000);
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
      title: 'All Plans',
      description: 'View all submitted plans',
      icon: <ClipboardList className="h-5 w-5" />,
      color: 'bg-amber-50 text-amber-600',
      isAction: true,
      action: handleViewAllLeads
    },
  ];

  if (isLoading) {
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

      {/* Recent Leads List */}
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
          {/* Commented out charts for future use */}
          {/* 
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 'var(--radius)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 6, fill: 'hsl(var(--primary))', stroke: 'hsl(var(--background))', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="sessions" 
                  stroke="#8884d8" 
                  strokeWidth={2.5} 
                  dot={false}
                  activeDot={{ r: 6, fill: '#8884d8', stroke: 'hsl(var(--background))', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          */}

          {/* 
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 'var(--radius)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                  }} 
                  formatter={(value) => [`$${value}`, 'Revenue']}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  fill="url(#colorRevenue)" 
                  activeDot={{ r: 6, fill: '#10b981', stroke: 'hsl(var(--background))', strokeWidth: 2 }}
                />
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
          */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
