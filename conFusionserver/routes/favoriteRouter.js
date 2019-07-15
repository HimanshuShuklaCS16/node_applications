const express =  require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const favorites = require('../models/favorite'); 
const dishes = require('../models/dishes'); 
var authenticate = require('../authenticate');
var cors = require('./cors');
const favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/favorites')
.options(cors.corsWithOptions,(req,res) => {
    res.sendStatus(200);
})
.get(cors.cors,authenticate.verifyUser,(req,res,next) => {
    favorites.findOne({user : req.user._id})
    .populate('user')
    .populate('dishes')
    .exec((err,favorite) => {
if(err) return err;
res.json(favorite);
    });
})
 
.post(cors.corsWithOptions, authenticate.verifyUser,(req,res,next) => {
    favorites.findOne({"user" : req.user._id})
    .then((favorite) =>{
        console.log(favorite);
        if(favorite != null)
        {
            for(var key in req.body) {
                if(req.body.hasOwnProperty(key)){
                        if(favorite.dishes.indexOf(req.params.dishid) == -1)
                        {
                            favorite.dishes.push(req.body[key]);
                   
                       
                        }
                        else
                        {
                            console.log('dish with id ' + req.body[key]._id +' already exists');
                            err = new Error('dish with id ' + req.body[key]._id +' already exists');
                            err.status = 400;
                        }
                        }
                        
                  
                }
                favorite.save();
                res.statusCode =200;
                res.setHeader('content-Type','application/json');
                res.json(favorite);
                
       
        }
        else{
            favorites.create({"user" : req.user._id,"dishes":[]})
            .then((favorite) => {
                for(var key in req.body) {
                    if(req.body.hasOwnProperty(key)){
                       
                        favorite.dishes.push(req.body[key]);
                      
                    }
                  }
                  favorite.save();
         res.statusCode =200;
        res.setHeader('content-Type','application/json');
        res.json(favorite);
            })
        }
    },(err) => {console.log(err)})
    .catch((err) => {console.log(err)})
})

.put(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
    res.statusCode = 403;
    res.end("put operation not allowed on /favorites");
})

.delete(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
    favorites.remove(() => {})
    .then((resp) => {
        res.statusCode =200;
        res.setHeader('content-Type','application/json');
        res.json(resp);
    },(err) => {console.log(err)})
    .catch((err) => {console.log(err)})
});

favoriteRouter.route('/favorites/:dishid')
.options(cors.corsWithOptions,(req,res) => {
    res.sendStatus(200);
})
.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
    var value = null;
    favorites.findOne({user : req.user._id})
    .then((favorite) => {
        if(favorite != null)
        {
            
            if(favorite.dishes.indexOf(req.params.dishid) == -1)
            {
                value = req.params.dishid;
                favorite.dishes.push(value); 
                favorite.save();
            }
            else
            {
                console.log('dish with id ' + req.params.dishid +' already exists');
                err = new Error('dish with id ' + req.params.dishid +' already exists');
                err.status = 400;
            }
        res.statusCode =200;
        res.setHeader('content-Type','application/json');
        res.json(favorite);
    }
    else
    {
        favorites.create({"user" : req.user._id,"dishes" :[]})
        .then((favorite) => {
        favorite.dishes.push(req.params.dishid);
        favorite.save();
        res.statusCode =200;
        res.setHeader('content-Type','application/json');
        res.json(favorite);
        })

    }
},(err) => {console.log(err)})
    .catch((err) => {console.log(err)})
})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
    favorites.findOne({user : req.user._id})
    .then((favorite) => {
    var index = favorite.dishes.indexOf(req.params.dishid);
    if (index > -1) {
        favorite.dishes.splice(index, 1);
        favorite.save();
     }
        res.statusCode =200;
        res.setHeader('content-Type','application/json');
        res.json(favorite);
    },(err) => {console.log(err)})
    .catch((err) => {console.log(err)})
})
.get(cors.cors,authenticate.verifyUser,(req,res,next) => {
    favorites.findOne({user : req.user._id})
    .then((favorite) => {
            if(!favorite)
            {
                res.statusCode =200;
                res.setHeader('content-Type','application/json');
                res.json({'exists' : 'false',"favorites" : favorite});
            }
            else if(favorite.dishes.indexOf(req.params.dishid) < 0)
            {
                res.statusCode =200;
                res.setHeader('content-Type','application/json');
                res.json({'exists' : 'false',"favorites" : favorite});
            }
            else
            {
                res.statusCode =200;
                res.setHeader('content-Type','application/json');
                res.json({'exists' : 'true',"favorites" : favorite});   
            }
    },(err) => next(err))
    .catch((err) => {next(err)})
})
.put(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
    res.statusCode = 403;
    res.end("put operation not allowed on /favorites/dish:id");
});

module.exports = favoriteRouter;