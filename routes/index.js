var express   = require('express');
var router    = express.Router();
var mongoose  = require('mongoose');
var bcrypt    = require('bcrypt');
var User      = require("../models/User");
const { check, validationResult } = require('express-validator/check');
const SECRET_KEY = 'key_that_shouldnot_appear_here';

// Get login
router.get('/', function(req, res, next) {
    res.render('login', {});
})

// POST login
router.post('/', async (req, res, next) => {
    var username = req.body.username;
    var user = await User.findOne({username: username}, (err, data) => {
        if(err) throw err;
    });

    if(!user) {
        res.status(400).send({message: "username doesn't exist."});
    } else {
        if (!bcrypt.compareSync(req.body.password, user.password)) {
            return res.send({
              status: 'error',  
              message: "password doesn't match."
            });
        } else {
            req.session.username = req.body.username;

            res.status(200).json({message: "success"});
        }
    }
});

// GET register
router.get('/register', function(req, res, next) {
    res.render('register', {});
})

// POST register
router.post('/register', async (req, res, next) => {
    var username = req.body.username;
    var password = req.body.password;

    var user = await User.findOne({username: username}, (err, data) => {
        if(err) throw err;
    });

    if(user) {
        res.send({message: "username has been used."});
    } else {
        
        var document = {
            username: username,
            password: password
        };
        
        var user = new User(document); 
        user.save(function(error){
            if(error) throw error;
        });

        res.status(200).json({message: "success"});
    }
});

// GET log out
router.get('/logout', (req, res)=> {
    req.session.username = null;
    res.redirect('/');
});

module.exports = router;