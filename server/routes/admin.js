const express = require('express');
const router = express.Router();
const { authenticate, authorize, checkAccountStatus } = require('../middleware/auth');
const db = require('../database');

// Get all users (Admin only)
router.get('/users', authenticate, authorize('super_admin'), (req, res) => {
  try {
    const users = db.getAllUsers();
    const sanitizedUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      balance: user.balance,
      accountStatus: user.accountStatus,
      createdAt: user.createdAt
    }));
    res.status(200).json(sanitizedUsers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all transactions (Admin only)
router.get('/transactions', authenticate, authorize('super_admin'), (req, res) => {
  try {
    const transactions = db.getAllTransactions();
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Fund an account (Admin only)
router.post('/fund-account', authenticate, authorize('super_admin'), (req, res) => {
  try {
    const { userId, amount } = req.body;
    
    if (!userId || !amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid userId or amount' });
    }
    
    const user = db.fundAccount(userId, amount);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Create transaction record
    db.createTransaction({
      userId,
      amount,
      type: 'deposit',
      status: 'approved',
      description: 'Admin funded account'
    });
    
    res.status(200).json({
      message: 'Account funded successfully',
      user: { id: user.id, name: user.name, balance: user.balance }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Withdraw from account (Admin only)
router.post('/withdraw-account', authenticate, authorize('super_admin'), (req, res) => {
  try {
    const { userId, amount } = req.body;
    
    if (!userId || !amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid userId or amount' });
    }
    
    const user = db.withdrawFromAccount(userId, amount);
    if (!user) {
      return res.status(400).json({ message: 'User not found or insufficient balance' });
    }
    
    // Create transaction record
    db.createTransaction({
      userId,
      amount,
      type: 'withdrawal',
      status: 'approved',
      description: 'Admin withdrew from account'
    });
    
    res.status(200).json({
      message: 'Amount withdrawn successfully',
      user: { id: user.id, name: user.name, balance: user.balance }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Freeze account (Admin only)
router.post('/freeze-account', authenticate, authorize('super_admin'), (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }
    
    const user = db.freezeAccount(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({
      message: 'Account frozen successfully',
      user: { id: user.id, name: user.name, accountStatus: user.accountStatus }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Unblock account (Admin only)
router.post('/unblock-account', authenticate, authorize('super_admin'), (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }
    
    const user = db.unblockAccount(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({
      message: 'Account unblocked successfully',
      user: { id: user.id, name: user.name, accountStatus: user.accountStatus }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Approve transaction (Admin only)
router.post('/approve-transaction', authenticate, authorize('super_admin'), (req, res) => {
  try {
    const { transactionId } = req.body;
    
    if (!transactionId) {
      return res.status(400).json({ message: 'transactionId is required' });
    }
    
    const transaction = db.updateTransaction(transactionId, { status: 'approved' });
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    res.status(200).json({
      message: 'Transaction approved successfully',
      transaction
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Reject transaction (Admin only)
router.post('/reject-transaction', authenticate, authorize('super_admin'), (req, res) => {
  try {
    const { transactionId } = req.body;
    
    if (!transactionId) {
      return res.status(400).json({ message: 'transactionId is required' });
    }
    
    const transaction = db.updateTransaction(transactionId, { status: 'failed' });
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    res.status(200).json({
      message: 'Transaction rejected successfully',
      transaction
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
