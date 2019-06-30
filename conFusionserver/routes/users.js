var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
var users =  require('../models/user');
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/signup',(req,res,next) => {
  users.findOne({username : req.body.username})
  .then((user) => {
    if(user != null)
    { 
      var err = new Error('username '+req.body.username + ' already  exists');
    err.status = 403;
    next(err);}
   else
   {
     return users.create({username : req.body.username,password : req.body.password});
   }
  })
.then((user) => {
res.statusCode = 200;
res.setHeader('content-Type','application/json');
res.json({status:'registration successful !!',User:user});
},(err) => next(err))
.catch((err) => next(err));
  });//signup part
  
router.post('/login',(req,res,next) => {
  if(!req.session.user){
    var authheader = req.headers.authorization;
    if(!authheader)
    {
      var err = new Error('You are not authenticated!!');
      res.setHeader('WWW-Authenticate','Basic');
      err.status = 401;
      next(err);
      return;
    }
    var auth = new Buffer.from(authheader.split(' ')[1],'base64').toString().split(':');
    var username = auth[0];
    var password = auth[1];
    users.findOne({username : username})
    .then((user) => {
      if(user === null)
      {
        var err = new Error('username ' + user + ' does not exist !!');
        err.status = 403;
        return next(err);
      }
      else if(user.password !== password)
      {
      var err = new Error('password for user ' + user.username + ' is wrong !!');
      err.status = 403;
      return next(err);
      }
      else if(user.username === username && user.password === password) 
      {
        req.session.user = 'authenticated';
        res.statusCode = 200;
        res.setHeader('content-Type','text/plain');
        res.end('you are authenticated !!');
      }
    })
    .catch((err) => next(err));
   
  }
  else{//if try to login when already logged in
        req.session.user = 'authenticated';
        res.statusCode = 200;
        res.setHeader('content-Type','text/plain');
        res.end('you are already authenticated !!');
  }
});//login part

router.post('/logout',(req,res) => {
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



module.exports = router;
