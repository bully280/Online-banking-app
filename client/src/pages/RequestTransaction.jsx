import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

const RequestTransaction = () => {
  const { token, user } = useContext(AuthContext);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [transactionType, setTransactionType] = useState('withdrawal');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!amount || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      const endpoint = transactionType === 'transfer' ? '/api/user/request-transfer' : '/api/user/request-withdrawal';
      await axios.post(endpoint, 
        { amount: parseFloat(amount), description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(`${transactionType === 'transfer' ? 'Transfer' : 'Withdrawal'} request submitted successfully!`);
      setAmount('');
      setDescription('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">New Request</h2>

        {error && <div className="bg-red-900 text-red-100 p-3 rounded mb-4">{error}</div>}
        {success && <div className="bg-green-900 text-green-100 p-3 rounded mb-4">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-2">Request Type</label>
            <select
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
              disabled={loading}
            >
              <option value="withdrawal">Withdrawal Request</option>
              <option value="transfer">Transfer Request</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-2">Amount ($)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Description (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter reason for request..."
              disabled={loading}
              rows="3"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full font-semibold"
          >
            {loading ? 'Submitting...' : '✓ Submit Request'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestTransaction;
