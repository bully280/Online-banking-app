import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const UsersList = () => {
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [fundAmount, setFundAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleFund = async () => {
    if (!selectedUser || !fundAmount || fundAmount <= 0) {
      alert('Please select a user and enter a valid amount');
      return;
    }

    try {
      await axios.post('/api/admin/fund-account', 
        { userId: selectedUser.id, amount: parseFloat(fundAmount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFundAmount('');
      fetchUsers();
      alert('Account funded successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to fund account');
    }
  };

  const handleWithdraw = async () => {
    if (!selectedUser || !withdrawAmount || withdrawAmount <= 0) {
      alert('Please select a user and enter a valid amount');
      return;
    }

    try {
      await axios.post('/api/admin/withdraw-account',
        { userId: selectedUser.id, amount: parseFloat(withdrawAmount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWithdrawAmount('');
      fetchUsers();
      alert('Withdrawal successful!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to withdraw');
    }
  };

  const handleFreeze = async (userId) => {
    if (window.confirm('Are you sure you want to freeze this account?')) {
      try {
        await axios.post('/api/admin/freeze-account',
          { userId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchUsers();
        alert('Account frozen successfully!');
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to freeze account');
      }
    }
  };

  const handleUnblock = async (userId) => {
    try {
      await axios.post('/api/admin/unblock-account',
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
      alert('Account unblocked successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to unblock account');
    }
  };

  if (loading) return <div className="text-center py-8">Loading users...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">All Users</h2>
          {error && <div className="bg-red-900 text-red-100 p-3 rounded mb-4">{error}</div>}
          
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Balance</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="font-medium">{user.name}</td>
                    <td>{user.email}</td>
                    <td className="font-semibold text-green-400">${user.balance.toFixed(2)}</td>
                    <td>
                      {user.accountStatus === 'blocked' ? (
                        <span className="badge badge-blocked">🔒 BLOCKED</span>
                      ) : (
                        <span className="badge badge-success">✓ Active</span>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="btn btn-secondary text-xs"
                      >
                        Select
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div>
        {selectedUser ? (
          <div className="card">
            <h3 className="text-xl font-bold mb-4">{selectedUser.name}</h3>
            <div className="space-y-4 mb-6 text-sm">
              <div>
                <p className="text-gray-400">Email</p>
                <p className="font-semibold">{selectedUser.email}</p>
              </div>
              <div>
                <p className="text-gray-400">Current Balance</p>
                <p className="text-2xl font-bold text-green-400">${selectedUser.balance.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-400">Account Status</p>
                <p className={selectedUser.accountStatus === 'blocked' ? 'text-red-400 font-bold' : 'text-green-400'}>
                  {selectedUser.accountStatus.toUpperCase()}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Fund Amount ($)</label>
                <input
                  type="number"
                  value={fundAmount}
                  onChange={(e) => setFundAmount(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
                <button onClick={handleFund} className="btn btn-success w-full mt-2">Fund Account</button>
              </div>

              <div>
                <label className="block text-sm mb-2">Withdraw Amount ($)</label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
                <button onClick={handleWithdraw} className="btn btn-warning w-full mt-2">Withdraw</button>
              </div>

              {selectedUser.accountStatus === 'blocked' ? (
                <button
                  onClick={() => handleUnblock(selectedUser.id)}
                  className="btn btn-success w-full"
                >
                  🔓 Unblock Account
                </button>
              ) : (
                <button
                  onClick={() => handleFreeze(selectedUser.id)}
                  className="btn btn-danger w-full"
                >
                  🔒 Freeze Account
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="card text-center text-gray-400">
            <p>Select a user to manage</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersList;
