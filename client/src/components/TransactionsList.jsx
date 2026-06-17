import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const TransactionsList = ({ isAdminView = false }) => {
  const { token } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const endpoint = isAdminView ? '/api/admin/transactions' : '/api/user/transactions';
      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'badge-success';
      case 'pending':
        return 'badge-pending';
      case 'failed':
        return 'badge-danger';
      default:
        return 'badge-pending';
    }
  };

  const getTypeLabel = (type) => {
    return type === 'deposit' ? '📥 Deposit' : '📤 Withdrawal';
  };

  if (loading) return <div className="text-center py-8">Loading transactions...</div>;

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6">Transactions</h2>
      {error && <div className="bg-red-900 text-red-100 p-3 rounded mb-4">{error}</div>}
      
      {transactions.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p>No transactions found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                {isAdminView && <th>User</th>}
                <th>Amount</th>
                <th>Type</th>
                <th>Status</th>
                <th>Description</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  {isAdminView && <td className="font-medium">{tx.userId}</td>}
                  <td className="font-semibold text-green-400">${tx.amount.toFixed(2)}</td>
                  <td>{getTypeLabel(tx.type)}</td>
                  <td><span className={`badge ${getStatusColor(tx.status)}`}>{tx.status.toUpperCase()}</span></td>
                  <td className="text-sm text-gray-400">{tx.description}</td>
                  <td className="text-sm text-gray-400">{new Date(tx.timestamp).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TransactionsList;
