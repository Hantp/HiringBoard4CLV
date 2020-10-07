const { arrayExpression } = require('babel-types');
var express   = require('express');
var router    = express.Router();
var mongoose  = require('mongoose');

var CandidateDB = require("../models/Candidate");
var counter = require("../models/Counter");

router.get('/', async function(req, res, next) {
    var candidate_data = await CandidateDB.find({}, (err, data) => {
        if(err) throw err;
    });

    var cards = [[], [], [], [], [], []];
    for(let i=0 ; i<candidate_data.length ; i++) {
        var section_id = candidate_data[i].section_id;

        cards[section_id].push(candidate_data[i]);
    }

    res.render('board', { CardsFromBack: cards});
});

// create new candidate
router.post('/', async (req, res, next) => {
    var id = 0;
    var count = await counter.findOne({_id: "userid"}, (err, data) => {
        if (err) throw err;
    });  
    if(count) {
        id = count.sequence_value;
    } else {
        counter.create({_id: "userid", sequence_value: 0}, (err, obj) => {
            if(err) throw err;
        });
    }

    var document = {
        id: id,
        name: req.body.name, 
        email: req.body.email,
        comment: req.body.comment, 
        stars: 0,
        section_id: 0
    };

    var candidate = new CandidateDB(document); 
    candidate.save(function(error){
        if(error) throw error;

        counter.findOneAndUpdate(
            {_id: "userid"},

            {
                $inc:{sequence_value:1},
            }, (err) => {
                if (err) throw err;
            });  
    });

    res.json({status: "success", message: id});
});

// drop candidate to a new section
router.put('/drop', async (req, res, next) => {
    var card_id = req.body.card_id;
    var section_id = req.body.section_id;

    // var candidate = await CandidateDB.findOne({email: candidate_email}, (err, data) => {
    //     if(err) throw err;
    // });

    var candidate_id = parseInt(card_id.substring(5));

    CandidateDB.updateOne({id: candidate_id}, {$set: {section_id: section_id}}, {upsert: true}, function(error, result){
        if(error) throw error;
    });
    res.json({message: "null", status: "success"});
});

// delete current candidate
router.put('/delete', (req, res, next) => {
    var candidate_id = parseInt(req.body.delete_id);
  
    CandidateDB.deleteOne({id: candidate_id}, (err, obj) => {
        if(err) throw err;
    });

    res.json({status: "success", message: "null"});
});
  
module.exports = router;