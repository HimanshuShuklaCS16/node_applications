const express =  require("express");
const bodyParser = require("body-parser");
const cors = require('./cors');
const mongoose = require('mongoose');
const promotions = require("../models/promotions");
var authenticate = require('../authenticate');
const promoRouter = express.Router();
promoRouter.use(bodyParser.json());

promoRouter.route('/promotions')
.options(cors.corsWithOptions,(req,res) => {
    res.sendStatus(200);
})
.get(cors.cors,(req,res,next) => {
    promotions.find(req.query)
    .then((promotions) => {
        res.statusCode =200;
        res.setHeader('content-Type','application/json');
        res.json(promotions);
    },(err) => {console.log(err)})
    .catch((err) => {console.log(err)})
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    promotions.create(req.body)
    .then((promotion) =>{
        console.log("promotion created :",promotion);
        res.statusCode =200;
        res.setHeader('content-Type','application/json');
        res.json(promotion);
    },(err) => {console.log(err)})
    .catch((err) => {console.log(err)})
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    res.statusCode = 403;
    res.end("put operation not allowed on /promotions");
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    promotions.remove(() => {})
    .then((resp) => {
        res.statusCode =200;
        res.setHeader('content-Type','application/json');
        res.json(resp);
    },(err) => {console.log(err)})
    .catch((err) => {console.log(err)})
});

promoRouter.route('/promotions/:promoid')
.options(cors.corsWithOptions,(req,res) => {
    res.sendStatus(200);
})
.get(cors.cors,(req,res,next) => {
    promotions.findById(req.params.promoid)
    .then((promotion) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    res.statusCode = 403;
    res.end("post operation not supported on /promotions/" + req.params.promoid);
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    promotions.findByIdAndUpdate(req.params.promoid,{
        $set:req.body
    },{new : true})
    .then((promotion) => {
        res.statusCode =200;
        res.setHeader('content-Type','application/json');
        res.json(promotion);
    },(err) => {console.log(err)})
    .catch((err) => {console.log(err)})
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    promotions.findByIdAndRemove(req.params.promoid)
    .then((resp) => {
        res.statusCode =200;
        res.setHeader('content-Type','application/json');
        res.json(resp);
    },(err) => {console.log(err)})
    .catch((err) => {console.log(err)})
});
module.exports=promoRouter;