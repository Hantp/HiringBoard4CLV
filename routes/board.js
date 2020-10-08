const { arrayExpression } = require('babel-types');
var express   = require('express');
var router    = express.Router();
var bodyParser = require('body-parser');
const multer=require("multer");
const fileUpload = require('express-fileupload');
var multipart = require('connect-multiparty'); //for files upload
var multipartMiddleware = multipart();//for files upload
var CandidateDB = require("../models/Candidate");
var counter = require("../models/Counter");
var RateDB = require("../models/Rate");
const { request } = require('express');

router.use(fileUpload());

router.get('/', async function(req, res, next) {
    var candidate_data = await CandidateDB.find({}, (err, data) => {
        if(err) throw err;
    });

    var cards = [[], [], [], [], [], []];
    for(let i=0 ; i<candidate_data.length ; i++) {
        var section_id = candidate_data[i].section_id;
        var average_rate = 0;
        if(candidate_data[i].rate_amount && candidate_data[i].rate_amount != 0) {
            average_rate = candidate_data[i].rate_sum*1.0 / candidate_data[i].rate_amount;
            average_rate = average_rate.toFixed(2);
        }
        
        var cand = {
            id: candidate_data[i].id,
            name: candidate_data[i].name,
            email: candidate_data[i].email,
            comment: candidate_data[i].comment,
            section_id: candidate_data[i].section_id,
            ave_rate: average_rate.toString()
        }; 

        cards[section_id].push(cand);
    }

    res.render('board', { CardsFromBack: cards});
});

// create new candidate
router.post('/', async (req, res, next) => {

    var candidate_data = await CandidateDB.findOne({email: req.body.email}, (err, obj) => {
        if(err) throw err;
    });

    if(candidate_data) {
        res.json({status : "error", message : "This email address has been used."});
    } else {
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
            comment: req.session.username + ": " + req.body.comment, 
            rate_amount: 0,
            rate_sum: 0,
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
    
        res.json({status: "success", message: {id: id, username: req.session.username}});
    }
    
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

    RateDB.deleteMany({candidate_id: candidate_id}, (err, r) => {
        if(err) throw err;
    });

    res.json({status: "success", message: "null"});
});

// router.post('/upload',  function(req, res, next) {
//     console.log(req.files);
//     if (!req.files || Object.keys(req.files).length === 0) {
//         return res.status(400).send('No files were uploaded.');
//     }

//     // Uploaded files:
//     console.log(req.files);
// });
  
// function uploadFile(req,res,next){
	
// 	let upload = multer({dest:"resume/"}).single('file');
// 	upload(req,res,(err)=>{
		
//         console.log(req.files);
// 		if(err){
// 	        res.send("err:"+err);
//         }
        
//         if(req.file){	    
// 	        req.body.attachment=req.files.filename;
	        
//         }
        
//         next();
// 	})
// }

router.post('/rate', async (req, res, next) => {
    var email = req.body.email;
    var comment = req.body.comment;
    var score = req.body.value;
    var currentUser = req.session.username;

    var candidate = await CandidateDB.findOne({email: email}, (err, obj) => {
        if(err) throw err;
    });

    if(!candidate) {
        res.json({status: "error", message: "email doesn't exist"});
    } else {
        var new_comment = "";
        if(comment && comment != "") {
            new_comment = "\n" + currentUser + ": " + comment;
        }

        var prev_score = 0;
        var num_rater = 1;
        var rate_query = await RateDB.findOne({rater: currentUser, candidate_id: candidate.id}, (err, obj) => {
            if(err) throw err;
        });

        if(rate_query) {
            prev_score = rate_query.score;
            num_rater = 0;
        }

        var diff = score - prev_score;
        new_comment = candidate.comment + new_comment;
        var num_all_rater = candidate.rate_amount + num_rater;
        var score_sum = candidate.rate_sum + diff;
        var new_ave_rate = 0;
        if(num_all_rater != 0) {
            new_ave_rate = score_sum*1.0 / num_all_rater;
            new_ave_rate.toFixed(2);
        }

        var document = {
            comment: new_comment,
            rate_amount: num_all_rater,
            rate_sum: score_sum
        };

        CandidateDB.updateOne({id: candidate.id}, {$set: document}, {upsert: true}, function(error, result){
            if(error) throw error;
        });

        RateDB.updateOne({rater: currentUser, candidate_id: candidate.id}, {$set: {score: score}}, {upsert: true}, function(error, result){
            if(error) throw error;
        });

        res.status(200).send({
            status:"success", 
            message: {
                comment: new_comment, 
                ave_rate: new_ave_rate, 
                id: candidate.id
            }
        });
    }
});

module.exports = router;