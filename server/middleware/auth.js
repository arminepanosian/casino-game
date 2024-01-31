const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.query.token || req.headers['x-access-token'];


  if (!token) {
    return res.status(403).json({ error: 'Token not provided' });
  }

  jwt.verify(token, 'your-secret-key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Failed to authenticate token' });
    }

    req.userId = decoded.userId;
    next();
  });
};

module.exports = {
  verifyToken,
};
