var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({

    id: {type: Number, required: 'ID must be provided', index: {unique: true, dropDups: true}},

    account:    { 
        type: String,    
        required:  [true, 'Email address cannot be left blank.'], index: {unique: true, dropDups: true}
    },

    password: { 
        type: String , 
        required: [true,  'Password cannot be left blank'],
        set(val) {
            return require('bcrypt').hashSync(val, 10);
        }
    }
});

module.exports = mongoose.model('Users', userSchema);