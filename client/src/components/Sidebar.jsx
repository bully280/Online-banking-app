import React from 'react';

const Sidebar = ({ activeTab, onTabChange, userRole }) => {
  const adminTabs = [
    { id: 'users', label: '👥 Users', icon: '👥' },
    { id: 'transactions', label: '💳 Transactions', icon: '💳' },
    { id: 'approvals', label: '✅ Approvals', icon: '✅' },
  ];

  const userTabs = [
    { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
    { id: 'transactions', label: '📋 History', icon: '📋' },
    { id: 'request', label: '➕ New Request', icon: '➕' },
  ];

  const tabs = userRole === 'super_admin' ? adminTabs : userTabs;

  return (
    <aside className="bg-gray-800 w-64 min-h-screen border-r border-gray-700 p-6 sticky top-0">
      <nav className="space-y-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
