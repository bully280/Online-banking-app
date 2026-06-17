const express = require('express');
const router = express.Router();
const { authenticate, checkAccountStatus } = require('../middleware/auth');
const db = require('../database');

// Get user dashboard (authenticated users)
router.get('/dashboard', authenticate, checkAccountStatus(db), (req, res) => {
  try {
    const user = db.getUser(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const transactions = db.getUserTransactions(user.id);
    const pendingCount = transactions.filter(t => t.status === 'pending').length;
    
    res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        balance: user.balance,
        accountStatus: user.accountStatus
      },
      stats: {
        totalTransactions: transactions.length,
        pendingRequests: pendingCount
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user transactions
router.get('/transactions', authenticate, checkAccountStatus(db), (req, res) => {
  try {
    const transactions = db.getUserTransactions(req.user.id);
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Request transfer (creates pending transaction)
router.post('/request-transfer', authenticate, checkAccountStatus(db), (req, res) => {
  try {
    const { amount, description } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }
    
    const user = db.getUser(req.user.id);
    if (user.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }
    
    const transaction = db.createTransaction({
      userId: req.user.id,
      amount,
      type: 'withdrawal',
      status: 'pending',
      description: description || 'Transfer request'
    });
    
    res.status(201).json({
      message: 'Transfer request submitted',
      transaction
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Request withdrawal
router.post('/request-withdrawal', authenticate, checkAccountStatus(db), (req, res) => {
  try {
    const { amount, description } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }
    
    const user = db.getUser(req.user.id);
    if (user.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }
    
    const transaction = db.createTransaction({
      userId: req.user.id,
      amount,
      type: 'withdrawal',
      status: 'pending',
      description: description || 'Withdrawal request'
    });
    
    res.status(201).json({
      message: 'Withdrawal request submitted',
      transaction
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
