var mongoose =require('mongoose');
var schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new schema({
    admin :{
        type : Boolean,
        default : false
    }
});
User.plugin(passportLocalMongoose);
module.exports = mongoose.model('User',User);