var passport = require('passport');
var localStrategy = require('passport-local');
var User = require('./models/user');  
var jwtStrategy = require('passport-jwt').Strategy;
var facebookTokenStrategy = require('passport-facebook-token');
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');//used to create,sign amd verify tokens
var config = require('./config.js');

exports.getToken = (user) => {
    return jwt.sign(user,config.secretKey,{expiresIn: 36000 });
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

    exports.verifyAdmin = (req,res,next) => {
if(req.user.admin === true)
    return next();
else
{
    err = new Error('You are not authorized');
    err.status = 403;
    return next(err);
}
    }
exports.facebookPassport = passport.use(new facebookTokenStrategy({
   clientID: config.facebook.clientId,
    clientSecret : config.facebook.clientSecret
},(accessToken,refreshToken,profile,done) => {
    User.findOne({facebookId : profile.id},(err,user) => {
        if(err)
        {
            return done(err,false);
        }
        if(!err && user!=null)
        {
            return done(null,user);
        }
        else
        {
            user = new User({username : profile.displayName});
            user.facebookId = profile.id;
            user.firstname = profile.name.givenName;
            user.lastname = profile.name.familyName;
            user.save((err,user) => {
                if(err) 
                    return done(err,false);
                else
                    return done(null,user);
            });
        }
    });
}));

    
 
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());