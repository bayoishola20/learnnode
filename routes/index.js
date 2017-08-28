const express = require('express');
const router = express.Router();

// Do work here
router.get('/', (req, res) => {
  res.send('Everything looks good! Let\'s go');
});

module.exports = router;
