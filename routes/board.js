var express   = require('express');
var router    = express.Router();
var mongoose  = require('mongoose');

/* GET login page. */
router.get('/', function(req, res, next) {
    res.render('board', { title: 'Home Page'});
})
  
module.exports = router;