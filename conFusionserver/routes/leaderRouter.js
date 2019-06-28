const express =  require("express");
const bodyParser = require("body-parser");

const mongoose = require('mongoose');
const leaders = require("../models/leaders");

const leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());

leaderRouter.route('/leaders')
.get((req,res,next) => {
    leaders.find({})
    .then((leaders) => {
        res.statusCode =200;
        res.setHeader('content-Type','application/json');
        res.json(leaders);
    },(err) => {console.log(err)})
    .catch((err) => {console.log(err)})
})
.post((req,res,next) => {
    leaders.create(req.body)
    .then((leader) =>{
        console.log("leader created :",leader);
        res.statusCode =200;
        res.setHeader('content-Type','application/json');
        res.json(leader);
    },(err) => {console.log(err)})
    .catch((err) => {console.log(err)})
})
.put((req,res,next) => {
    res.statusCode = 403;
    res.end("put operation not allowed on /leaders");
})
.delete((req,res,next) => {
    leaders.remove(() => {})
    .then((resp) => {
        res.statusCode =200;
        res.setHeader('content-Type','application/json');
        res.json(resp);
    },(err) => {console.log(err)})
    .catch((err) => {console.log(err)})
});

leaderRouter.route('/leaders/:leaderid')
.get((req,res,next) => {
    leaders.findById(req.params.leaderid)
    .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req,res,next) => {
    res.statusCode = 403;
    res.end("post operation not supported on /leaders/" + req.params.leaderid);
})
.put((req,res,next) => {
    leaders.findByIdAndUpdate(req.params.leaderid,{
        $set:req.body
    },{new : true})
    .then((leader) => {
        res.statusCode =200;
        res.setHeader('content-Type','application/json');
        res.json(leader);
    },(err) => {console.log(err)})
    .catch((err) => {console.log(err)})
})
.delete((req,res,next) => {
    leaders.findByIdAndRemove(req.params.leaderid)
    .then((resp) => {
        res.statusCode =200;
        res.setHeader('content-Type','application/json');
        res.json(resp);
    },(err) => {console.log(err)})
    .catch((err) => {console.log(err)})
});
module.exports=leaderRouter;