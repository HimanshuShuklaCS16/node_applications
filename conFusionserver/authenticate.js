var passport = require('passport');
var localStrategy = require('passport-local');
var User = require('./models/user');  
var jwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');//used to create,sign amd verify tokens
var config = require('./config.js');

exports.getToken = (user) => {
    return jwt.sign(user,config.secretKey,{expiresIn: 3600 });
};

var opts ={};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new jwtStrategy(opts,
    (jwt_payload,done) => {
        console.log("jwt_Payload",jwt_payload);
        User.findOne({_id : jwt_payload._id},(err,user) => {
            if(err){
                return done(err,false);
            }
            else if(user){
                return done(null,user);
            }
            else{
                return done(null,false);
            }
        });
    }));
    exports.verifyUser = passport.authenticate('jwt',{session : false});
 
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());