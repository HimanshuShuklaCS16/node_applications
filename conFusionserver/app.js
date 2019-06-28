var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const dishes = require('./models/dishes');
const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url);
connect.then((db) => {
  console.log('connected correctly to the server!!');
},(err) => {console.log(err);});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter= require('./routes/dishRoute');
var leaderRouter= require('./routes/leaderRouter');
var promoRouter= require('./routes/promoRouter');

var app = express();

app.use('/',dishRouter);
app.use('/',leaderRouter);
app.use('/',promoRouter);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

function auth(req,res,next){
  console.log(req.headers);
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
  if(username == 'admin' && password == 'password')
  {
    next(); //authorized
  }
  else{
    var err = new Error('You are not authenticated!!');
    res.setHeader('WWW-Authenticate','Basic');
    err.status = 401;
    next(err);
    return;
  }
}
app.use(auth);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
