const express = require('express');
const router = express.Router();

// Do work here
router.get('/', (req, res) => {
  //const human = { name: "Bayo", age: 2, location: "Nigeria" };
  // res.send('Everything looks good! Let\'s get going!!!');
  /*res.json(human);
  res.json(req.query.name);
  res.json(req.query);*/
  res.render('hello', {
    name: req.query.name,
    age: 105,
    title: 'Hello'
  });
});

//reverses the request
/*router.get('/reverse/:name', (req, res) => {
  const reverse = [...req.params.name].reverse().join('')
  res.send(reverse);
});*/

module.exports = router;
