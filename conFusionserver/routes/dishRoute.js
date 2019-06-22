const express =  require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const dishes = require('../models/dishes'); 

const dishRouter = express.Router();
dishRouter.use(bodyParser.json());

dishRouter.route('/dishes')
.get((req,res,next) => {
    dishes.find({})
    .then((dishes) => {
        res.statusCode =200;
        res.setHeader('content-Type','application/json');
        res.json(dishes);
    },(err) => {console.log(err)})
    .catch((err) => {console.log(err)})
})
.post((req,res,next) => {
    dishes.create(req.body)
    .then((dish) =>{
        console.log("dish created :",dish);
        res.statusCode =200;
        res.setHeader('content-Type','application/json');
        res.json(dish);
    },(err) => {console.log(err)})
    .catch((err) => {console.log(err)})
})
.put((req,res,next) => {
    res.statusCode = 403;
    res.end("put operation not allowed on /dishes");
})
.delete((req,res,next) => {
    dishes.remove(() => {})
    .then((resp) => {
        res.statusCode =200;
        res.setHeader('content-Type','application/json');
        res.json(resp);
    },(err) => {console.log(err)})
    .catch((err) => {console.log(err)})
});

dishRouter.route('/dishes/:dishid')
.get((req,res,next) => {
    dishes.findById(req.params.dishid)
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req,res,next) => {
    res.statusCode = 403;
    res.end("post operation not supported on /dishes/" + req.params.dishid);
})
.put((req,res,next) => {
    dishes.findByIdAndUpdate(req.params.dishid,{
        $set:req.body
    },{new : true})
    .then((dish) => {
        res.statusCode =200;
        res.setHeader('content-Type','application/json');
        res.json(dish);
    },(err) => {console.log(err)})
    .catch((err) => {console.log(err)})
})
.delete((req,res,next) => {
    dishes.findByIdAndRemove(req.params.dishid)
    .then((resp) => {
        res.statusCode =200;
        res.setHeader('content-Type','application/json');
        res.json(resp);
    },(err) => {console.log(err)})
    .catch((err) => {console.log(err)})
});
module.exports=dishRouter;