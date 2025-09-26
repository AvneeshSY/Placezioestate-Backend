const express = require('express');
const jwt = require('jsonwebtoken'); 
require('dotenv').config();

const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check if username and password match the predefined ones
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    // Generate a token
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    return res.status(200).json({
      message: 'Login successful!',
      token, // Send the token back to the client
      status: 200
    });
  } else {
    return res.status(401).json({
      message: 'Invalid credentials!',
      status: 401
    });
  }
});

module.exports = router;
