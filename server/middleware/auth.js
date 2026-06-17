const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_jwt_key_here');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const authorize = (role) => {
  return (req, res, next) => {
    if (req.user?.role !== role) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }
    next();
  };
};

const checkAccountStatus = (db) => {
  return (req, res, next) => {
    const user = db.getUser(req.user?.id);
    if (user?.accountStatus === 'blocked') {
      return res.status(403).json({ message: 'Your account has been blocked. Contact support.' });
    }
    next();
  };
};

module.exports = {
  authenticate,
  authorize,
  checkAccountStatus
};
