var express = require('express');
var router = express.Router();
const BaseUrl="http://localhost:9000";


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
