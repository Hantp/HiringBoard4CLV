var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    candidate_id: {type: String},
    rater: {type: String},
    score: {type: Number}
});

module.exports = mongoose.model('Rates', userSchema);