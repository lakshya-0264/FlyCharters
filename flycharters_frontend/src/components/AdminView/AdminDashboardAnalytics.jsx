import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, Plane, Calendar, MapPin } from 'lucide-react';

const AnalyticsDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    overview: {},
    bookings: {},
    fleet: {},
    operators: {},
    routes: {}
  });
  const [error, setError] = useState(null);

  // API base URL - update this to match your backend
  const API_BASE = 'http://localhost:8080/analytics';

  const fetchData = async (endpoint, key) => {
    try {
      setLoading(true);
      
      // Get token from localStorage - adjust the key name as needed
      const token = localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('accessToken');
      
      const headers = {
        'Content-Type': 'application/json',
      };
      
      // Add authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      console.log(`Fetching: ${API_BASE}${endpoint}`);
      console.log('Headers:', headers);
      
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'GET',
        headers,
        credentials: 'include', // Include cookies for session-based auth
      });
      
      console.log(`Response status for ${key}:`, response.status);
      
      if (!response.ok) {
        // Log the response text for debugging
        const errorText = await response.text();
        console.error(`HTTP ${response.status} for ${key}:`, errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await response.text();
        console.error(`Expected JSON but got ${contentType} for ${key}:`, responseText.substring(0, 200));
        throw new Error(`Expected JSON response but got ${contentType}`);
      }
      
      const result = await response.json();
      console.log(`Data received for ${key}:`, result);
      
      if (result.success) {
        setData(prev => ({ ...prev, [key]: result.data }));
        setError(null);
      } else {
        console.error(`API returned success: false for ${key}:`, result.message);
        setError(`API Error: ${result.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error(`Error fetching ${key} data:`, error);
      setError(`Network Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load all required data
    fetchData('/overview', 'overview');
    fetchData('/bookings?period=30days', 'bookings');
    fetchData('/fleet-utilization', 'fleet');
    fetchData('/operators', 'operators');
    fetchData('/routes', 'routes');
  }, []);

  const StatCard = ({ title, value, icon: Icon, color = "blue" }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Prepare data for charts
  const dailyData = data.bookings.dailyBookings?.map(item => ({
    date: formatDate(item._id),
    total: item.totalBookings,
    confirmed: item.confirmedBookings,
    cancelled: item.cancelledBookings
  })) || [];

  const statusData = data.bookings.statusBreakdown?.map(item => ({
    name: item._id,
    value: item.count
  })) || [];

  // Convert aircraft type data for pie chart
  const typeData = data.fleet.aircraftTypeStats?.slice(0, 8).map(item => ({
    name: item._id,
    value: item.totalQuotes
  })) || [];

  const topOperators = data.operators.topOperators?.slice(0, 10) || [];
  const routeData = data.routes.popularRoutes?.slice(0, 10) || [];
  const airportData = data.routes.busyAirports?.slice(0, 10) || [];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Comprehensive insights into your aviation business</p>
          
          {/* Error Display */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
                <div className="ml-auto pl-3">
                  <button 
                    onClick={() => setError(null)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <span className="sr-only">Dismiss</span>×
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-8">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Total Bookings"
              value={data.overview.totalBookings || 0}
              icon={Calendar}
              color="blue"
            />
            <StatCard
              title="Active Fleet"
              value={data.overview.activeFleets || 0}
              icon={Plane}
              color="purple"
            />
            <StatCard
              title="Total Users"
              value={data.overview.totalUsers || 0}
              icon={Users}
              color="orange"
            />
          </div>

          {/* Bookings Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Booking Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="total" stroke="#3B82F6" strokeWidth={2} name="Total" />
                  <Line type="monotone" dataKey="confirmed" stroke="#10B981" strokeWidth={2} name="Confirmed" />
                  <Line type="monotone" dataKey="cancelled" stroke="#EF4444" strokeWidth={2} name="Cancelled" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Status Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Fleet and Operators Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Aircraft Type Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={typeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    // label={({ name, percent, value }) => `${name} (${value})`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {typeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [value, 'Quotes']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Operators by Revenue</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topOperators}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    interval={0}
                  />
                  <YAxis tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Bar dataKey="totalRevenue" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Routes Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Routes</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bookings</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Cost</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distance</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {routeData.map((route, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="font-medium">{route._id.fromCode} → {route._id.toCode}</span>
                        </div>
                        <div className="text-sm text-gray-500">{route._id.from} → {route._id.to}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{route.totalBookings}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(route.totalRevenue)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(route.avgCost)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{route.avgDistance?.toFixed(0)} km</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Airports and Distance Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Busiest Airports</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={airportData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="source_IATA" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="totalTraffic" fill="#06B6D4" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Distance Analysis</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.routes.distanceAnalysis}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#84CC16" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;