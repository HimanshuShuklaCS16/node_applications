var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
var users =  require('../models/user');
router.use(bodyParser.json());
var passport = require('passport');
var authenticate = require('../authenticate');
const cors = require('./cors');
/* GET users listing. */
router.route('/')
.options(cors.corsWithOptions,(req,res) => {
  res.sendStatus(200);
})
.get(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, function(req, res, next) {
  users.find({})
  .then((users) => {
      res.statusCode =200;
      res.setHeader('content-Type','application/json');
      res.json(users);
  },(err) => {console.log(err)})
  .catch((err) => {console.log(err)})
});
router.post('/signup',cors.corsWithOptions,(req,res,next) => {
  users.register(new users({username : req.body.username}),
  req.body.password,(err,user) => {
if(err)
{
  res.statusCode = 500;
  res.setHeader('content-Type','application/json');
  res.json({err : err});  
}
else{
  if(req.body.firstname)
    user.firstname = req.body.firstname;
  if(req.body.lastname)
    user.lastname = req.body.lastname;
  user.save((err,user) => {
    if(err)
    {
  res.statusCode = 500;
  res.setHeader('content-Type','application/json');
  res.json({err : err});  
    }
    passport.authenticate('local')(req,res,() => {
      res.statusCode = 200;
  res.setHeader('content-Type','application/json');
  res.json({success : true,status:'registration successful !!'});
  });
  });
}
  });
});
//signup part
  
router.post('/login',cors.corsWithOptions,(req,res,next) => {
  passport.authenticate('local',(err,user,info) => {
    if(err)
    {
      return next(err);
    }
    if(!user)
    { 
      res.statusCode = 401;
      res.setHeader('content-Type','application/json');
      res.json({success : false,status:'login Unsuccessful !!',err:info});

    }
    req.logIn(user , (err) => 
    {
      if(err)
        {
          res.statusCode = 401;
          res.setHeader('content-Type','application/json');
          res.json({success : false,status:'login Unsuccessful !!',err:'could not login user !!!'});
        }
      var token = authenticate.getToken({_id:req.user._id});
      res.statusCode = 200;
      res.setHeader('content-Type','application/json');
      res.json({success : true,token : token,status:'You are successfully logged in !!!'});

    });
  })(req,res,next);
});//login part

router.get('/checkJWTtoken',cors.corsWithOptions,(req,res) => {
  passport.authenticate('jwt',(err,user,info) => {
    if(err)
      return next(err);
    else if(!user)
    {
      res.statusCode = 401;
      res.setHeader('content-Type','application/json');
      res.json({success : false,status:'jwt invalid !!!',err:info});
    } 
    else
    {
      res.statusCode = 200;
      res.setHeader('content-Type','application/json');
      res.json({success : true,status:'jwt valid !!!',user : user});
    }  
  })(req,res,next);
});

router.post('/logout',cors.corsWithOptions,(req,res) => {
  if(req.session)
    {
      req.session.destroy();
      res.clearCookie('session-id');
      res.redirect('/');
    }
    else
    {
      var err = new Error('you are not logged in!!');
      err.status = 403;
      next(err);
    }
});

router.get('/facebook/token',passport.authenticate('facebook-token'),(req,res) => {
  if(req.user)
  {
    var token = authenticate.getToken({_id:req.user._id});
    res.statusCode = 200;
    res.setHeader('content-Type','application/json');
    res.json({success : true,token : token,status:'You are successfully logged in !!!'});
  }
});

module.exports = router;
