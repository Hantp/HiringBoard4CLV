var mongoose = require('mongoose');

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

var userSchema = new mongoose.Schema({

    id: {type: Number, required: 'ID must be provided', index: {unique: true, dropDups: true}},

    name: { type: String,  required: [true, 'Full name must be provided'] },

    email:    { 
    
        type: String,     
        Required:  'Email address cannot be left blank.',
        validate: [validateEmail, 'Please fill a valid email address'],
             match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        index: {unique: true, dropDups: true}
    },

    comment: {type: String},

    stars: {type: Number},
    
    section_id: {type: Number}

});

module.exports = mongoose.model('Candidates', userSchema);