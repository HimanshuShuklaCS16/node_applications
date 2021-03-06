var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const dishes = require('./models/dishes');
var config = require('./config');
const url = config.mongoUrl;
const connect = mongoose.connect(url);
connect.then((db) => {
  console.log('connected correctly to the server!!');
},(err) => {console.log(err);});

var passport = require('passport');
var authenticate = require('./authenticate');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter= require('./routes/dishRoute');
var leaderRouter= require('./routes/leaderRouter');
var promoRouter= require('./routes/promoRouter');
var uploadRouter= require('./routes/uploadRouter');
var favoriteRouter= require('./routes/favoriteRouter');

var session = require('express-session');
var fileStore = require('session-file-store')(session);
var app = express();

app.all('*',(req,res,next) => {
  if(req.secure)
  {
    return next();
  }
  else{
    res.redirect(307,'https://' + req.hostname + ':' +app.get('secport') + req.url)
  }
});

//app.use(cookieParser('12345-67891-23412-76754'));
/*app.use(session({
  name : 'session-id',
  secret : '12345-67891-23412-76754',
  saveUninitialized : false ,
  resave : false ,
  store : new fileStore()
  }));//session created with a session id
  app.use(passport.session());
  */
app.use(passport.initialize());
app.use('/', indexRouter);
app.use('/users', usersRouter);


app.use('/',dishRouter);
app.use('/',leaderRouter);
app.use('/',promoRouter);
app.use('/imageUpload',uploadRouter);
app.use('/',favoriteRouter);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use(express.static(path.join(__dirname, 'public')));



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
