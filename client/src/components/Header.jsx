import React from 'react';

const Header = ({ user, onLogout }) => {
  return (
    <header className="bg-gray-800 border-b border-gray-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="text-2xl font-bold text-blue-500">🏦</div>
          <h1 className="text-2xl font-bold text-white">SecureBank</h1>
        </div>
        
        {user && (
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <p className="text-sm text-gray-400">Welcome back</p>
              <p className="font-semibold text-white">{user.name}</p>
            </div>
            {user.role === 'super_admin' && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-900 text-purple-200">
                ADMIN
              </span>
            )}
            <button
              onClick={onLogout}
              className="btn btn-danger"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
