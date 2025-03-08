
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { ArrowUpRight, Users, DollarSign, ShoppingCart, Activity } from 'lucide-react';

// Sample data
const generateData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
  
  return months.map(month => ({
    name: month,
    users: Math.floor(Math.random() * 2000) + 1000,
    sessions: Math.floor(Math.random() * 3000) + 2000,
    revenue: Math.floor(Math.random() * 10000) + 5000,
  }));
};

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setData(generateData());
      setIsLoading(false);
    }, 1000);
  }, []);

  // Stats cards data
  const stats = [
    {
      title: 'Total Users',
      value: '2,834',
      increase: '+12.5%',
      icon: <Users className="h-5 w-5" />,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Revenue',
      value: '$48,385',
      increase: '+8.2%',
      icon: <DollarSign className="h-5 w-5" />,
      color: 'bg-green-50 text-green-600',
    },
    {
      title: 'Orders',
      value: '1,498',
      increase: '+4.3%',
      icon: <ShoppingCart className="h-5 w-5" />,
      color: 'bg-purple-50 text-purple-600',
    },
    {
      title: 'Conversion',
      value: '3.24%',
      increase: '+2.1%',
      icon: <Activity className="h-5 w-5" />,
      color: 'bg-amber-50 text-amber-600',
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
            className="glass-card rounded-xl p-6 hover-scale shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <h3 className="text-2xl font-semibold mt-1">{stat.value}</h3>
                <div className="flex items-center mt-1 text-xs font-medium text-emerald-600">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  <span>{stat.increase} from last month</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Chart */}
      <div className="glass-card rounded-xl p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Users Overview</h2>
          <p className="text-muted-foreground text-sm">Monthly active users and sessions</p>
        </div>
        
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
      </div>

      {/* Secondary Chart */}
      <div className="glass-card rounded-xl p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Revenue Trends</h2>
          <p className="text-muted-foreground text-sm">Monthly revenue performance</p>
        </div>
        
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
      </div>
    </div>
  );
};

export default Dashboard;
