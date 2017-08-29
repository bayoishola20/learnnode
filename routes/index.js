const express = require('express');
const router = express.Router();

// Do work here
router.get('/', (req, res) => {
  // const human = { name: "Bayo", age: 2, location: "Nigeria" };
  res.send('Everything looks good! Let\'s get going!!!');
  // res.json(human);
  // res.json(req.query.name);
});

module.exports = router;
