import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import UsersList from '../components/UsersList';
import TransactionsList from '../components/TransactionsList';
import ApprovalPanel from '../components/ApprovalPanel';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('users');
  const [totalFunding, setTotalFunding] = useState(0);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
    }
  }, [isAdmin, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <UsersList />;
      case 'transactions':
        return <TransactionsList isAdminView={true} />;
      case 'approvals':
        return <ApprovalPanel />;
      default:
        return <UsersList />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} userRole="super_admin" />
      
      <main className="flex-1 overflow-auto">
        <Header user={user} onLogout={handleLogout} />
        
        <div className="p-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="card">
              <p className="text-gray-400 text-sm">Total Users</p>
              <p className="text-3xl font-bold text-blue-400 mt-2">12</p>
            </div>
            <div className="card">
              <p className="text-gray-400 text-sm">Pending Approvals</p>
              <p className="text-3xl font-bold text-yellow-400 mt-2">5</p>
            </div>
            <div className="card">
              <p className="text-gray-400 text-sm">Total Platform Balance</p>
              <p className="text-3xl font-bold text-green-400 mt-2">$1.2M</p>
            </div>
          </div>

          {/* Main Content */}
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
