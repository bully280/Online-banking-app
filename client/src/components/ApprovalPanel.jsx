import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const ApprovalPanel = () => {
  const { token } = useContext(AuthContext);
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPendingTransactions();
  }, []);

  const fetchPendingTransactions = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/transactions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const pending = response.data.filter(tx => tx.status === 'pending');
      setPendingTransactions(pending);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch pending transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (transactionId) => {
    try {
      await axios.post('/api/admin/approve-transaction',
        { transactionId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPendingTransactions();
      alert('Transaction approved!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve transaction');
    }
  };

  const handleReject = async (transactionId) => {
    if (window.confirm('Are you sure you want to reject this transaction?')) {
      try {
        await axios.post('/api/admin/reject-transaction',
          { transactionId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchPendingTransactions();
        alert('Transaction rejected!');
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to reject transaction');
      }
    }
  };

  if (loading) return <div className="text-center py-8">Loading approvals...</div>;

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6">Pending Approvals</h2>
      {error && <div className="bg-red-900 text-red-100 p-3 rounded mb-4">{error}</div>}
      
      {pendingTransactions.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p>✓ No pending transactions</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingTransactions.map((tx) => (
            <div key={tx.id} className="bg-gray-700 p-4 rounded-lg flex justify-between items-center">
              <div>
                <p className="font-semibold">User ID: {tx.userId}</p>
                <p className="text-gray-400">{tx.description}</p>
                <p className="text-lg font-bold text-yellow-400 mt-2">${tx.amount.toFixed(2)}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleApprove(tx.id)}
                  className="btn btn-success"
                >
                  ✓ Approve
                </button>
                <button
                  onClick={() => handleReject(tx.id)}
                  className="btn btn-danger"
                >
                  ✗ Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApprovalPanel;
