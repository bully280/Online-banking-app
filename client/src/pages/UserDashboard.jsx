import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import TransactionsList from '../components/TransactionsList';
import RequestTransaction from './RequestTransaction';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, token, isAdmin } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAdmin) {
      navigate('/admin/dashboard');
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    if (user?.accountStatus === 'blocked') {
      setError('🔒 Your account has been blocked. Please contact support.');
    }
    fetchDashboardData();
  }, [token]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/user/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDashboardData(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <UserDashboardView data={dashboardData} loading={loading} error={error} />;
      case 'transactions':
        return <TransactionsList isAdminView={false} />;
      case 'request':
        return <RequestTransaction />;
      default:
        return <UserDashboardView data={dashboardData} loading={loading} error={error} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} userRole="standard_user" />
      
      <main className="flex-1 overflow-auto">
        <Header user={user} onLogout={handleLogout} />
        
        <div className="p-8">
          {user?.accountStatus === 'blocked' && (
            <div className="bg-red-900 border-l-4 border-red-500 text-red-100 p-4 mb-8 rounded">
              <p className="font-bold">🔒 Account Blocked</p>
              <p>Your account has been blocked by the system administrator.</p>
              <p className="text-sm mt-2">Please contact support for more information.</p>
            </div>
          )}
          
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

const UserDashboardView = ({ data, loading, error }) => {
  if (loading) return <div className="text-center py-8">Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      {error && <div className="bg-red-900 text-red-100 p-4 rounded">{error}</div>}
      
      {data && (
        <>
          {/* Balance Card */}
          <div className="card bg-gradient-to-br from-blue-900 to-blue-800">
            <p className="text-gray-300 text-sm mb-2">Available Balance</p>
            <p className="text-5xl font-bold text-white">${data.user.balance.toFixed(2)}</p>
            <p className="text-gray-400 text-sm mt-4">Account Status: 
              <span className={data.user.accountStatus === 'blocked' ? ' text-red-400 font-bold' : ' text-green-400'}>
                {data.user.accountStatus.toUpperCase()}
              </span>
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card">
              <p className="text-gray-400 text-sm">Total Transactions</p>
              <p className="text-3xl font-bold text-blue-400 mt-2">{data.stats.totalTransactions}</p>
            </div>
            <div className="card">
              <p className="text-gray-400 text-sm">Pending Requests</p>
              <p className={`text-3xl font-bold mt-2 ${data.stats.pendingRequests > 0 ? 'text-yellow-400' : 'text-green-400'}`}>
                {data.stats.pendingRequests}
              </p>
            </div>
          </div>

          {/* Recent Transactions */}
          <TransactionsList isAdminView={false} />
        </>
      )}
    </div>
  );
};

export default UserDashboard;
