const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateUser = (req, res, next) => {

  if (req.path === '/' || req.path.startsWith('/auth')) {
    return next();
  }
  
  const token = req.headers.authorization?.split(' ')[1];
  console.log('Request Headers:', req.headers);
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = { authenticateUser };
