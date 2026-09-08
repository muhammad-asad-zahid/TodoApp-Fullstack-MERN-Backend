const jwt = require('jsonwebtoken');

const authUser = (req, res, next) => {
    console.log('hello form auth middle')
  try {
    // 1. Check for token in cookies first, then fallback to Authorization header
    let token = req.cookies?.auth_token;

    const authHeader = req.headers.authorization;
    if (!token && authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    // 2. Reject if no token was found
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // 3. Ensure secret exists in environment
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      console.error('CRITICAL: JWT_SECRET is not defined in environment variables.');
      return res.status(500).json({ message: 'Internal server error' });
    }

    // 4. Verify token
    const decoded = jwt.verify(token, secretKey);

    // Attach decoded user payload (e.g. { userId, email }) to request
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = authUser;