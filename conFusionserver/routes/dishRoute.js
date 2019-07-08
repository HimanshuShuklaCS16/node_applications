const express =  require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const dishes = require('../models/dishes'); 
var authenticate = require('../authenticate');
var cors = require('./cors');
const dishRouter = express.Router();
dishRouter.use(bodyParser.json());

dishRouter.route('/dishes')
.options(cors.corsWithOptions,(req,res) => {
    res.sendStatus(200);
})
.get(cors.cors,(req,res,next) => {
    dishes.find({})
    .populate('comments.author')
    .then((dishes) => {
        res.statusCode =200;
        res.setHeader('content-Type','application/json');
        res.json(dishes);
    },(err) => {console.log(err)})
    .catch((err) => {console.log(err)})
})
.post(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    dishes.create(req.body)
    .then((dish) =>{
        console.log("dish created :",dish);
        res.statusCode =200;
        res.setHeader('content-Type','application/json');
        res.json(dish);
    },(err) => {console.log(err)})
    .catch((err) => {console.log(err)})
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    res.statusCode = 403;
    res.end("put operation not allowed on /dishes");
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    dishes.remove(() => {})
    .then((resp) => {
        res.statusCode =200;
        res.setHeader('content-Type','application/json');
        res.json(resp);
    },(err) => {console.log(err)})
    .catch((err) => {console.log(err)})
});

dishRouter.route('/dishes/:dishid')
.options(cors.corsWithOptions,(req,res) => {
    res.sendStatus(200);
})
.get(cors.cors,(req,res,next) => {
    dishes.findById(req.params.dishid)
    .populate('comments.author')
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    res.statusCode = 403;
    res.end("post operation not supported on /dishes/" + req.params.dishid);
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
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
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    dishes.findByIdAndRemove(req.params.dishid)
    .then((resp) => {
        res.statusCode =200;
        res.setHeader('content-Type','application/json');
        res.json(resp);
    },(err) => {console.log(err)})
    .catch((err) => {console.log(err)})
});
dishRouter.route('/dishes/:dishid/comments')
.options(cors.corsWithOptions,(req,res) => {
    res.sendStatus(200);
})
.get(cors.cors,(req,res,next) => {
    dishes.findById(req.params.dishid)
    .populate('comments.author')
    .then((dish) => {
        if(dish != null)
        {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish.comments);
        }
        else{
            err = new Error('Dish' + req.params.dishid + 'not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
    res.statusCode = 403;
    res.end("post operation not supported on /dishes/" + req.params.dishid + "/comments");
})
.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
    dishes.findById(req.params.dishid)
    .then((dish) => {
        if(dish != null)
        {
        req.body.author = req.user._id;
        dish.comments.push(req.body);
        dish.save()
        .then((dish) => {
            dishes.findById(dish._id)
            .populate('comments.author')
            .then((dish) => 
            {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.comments);
            })
        },(err) => {console.log(err)})
        }
        else{
            err = new Error('Dish' + req.params.dishid + 'not found');
            err.status = 404;
            return next(err);
        }
    },(err) => {console.log(err)})
    .catch((err) => {console.log(err)})
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    dishes.findById(req.params.dishid)
    .then((dish) => {
        if(dish != null)
        {
            for(var i = (dish.comments.length - 1);i>=0;i--)
            {
                dish.comments.id(dish.comments[i]._id).remove();
            }
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish.comments);
            },(err) => {console.log(err)})
        }
        else{
            err = new Error('Dish' + req.params.dishid + 'not found');
            err.status = 404;
            return next(err);
        }
    },(err) => {console.log(err)})
    .catch((err) => {console.log(err)})
});
dishRouter.route('/dishes/:dishid/comments/:commentid')
.options(cors.corsWithOptions,(req,res) => {
    res.sendStatus(200);
})
.get(cors.cors,(req,res,next) => {
    dishes.findById(req.params.dishid)
    .populate('comments.author')
    .then((dish) => {
        if((dish != null) && (dish.comments.id(req.params.commentid)) != null)
        {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish.comments.id(req.params.commentid));
        }
        else if(dish == null)
        {
            err = new Error('Dish' + req.params.dishid + 'not found');
            err.status = 404;
            return next(err);
        }
        else{
            err = new Error('comment' + req.params.commentid + 'not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
    res.statusCode = 403;
    res.end("push operation not supported on /dishes/" + req.params.dishid + "/comments/" + req.params.commentid);
})
.put(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
    dishes.findById(req.params.dishid)
    .then((dish) => {
        var author = dish.comments.id(req.params.commentid).author;
        if((req.user._id).equals(author))
        {
        if((dish != null) && (dish.comments.id(req.params.commentid)) != null)
        {
        if(req.body.rating)
        dish.comments.id(req.params.commentid).rating = req.body.rating;
        if(req.body.comment)
        dish.comments.id(req.params.commentid).comment = req.body.comment;
        dish.save()
        .then((dish) => {
            dishes.findById(dish._id)
            .populate('comments.author')
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            });
        },(err) => {next(err)})
        }
        else if(dish == null)
        {
            err = new Error('Dish' + req.params.dishid + 'not found');
            err.status = 404;
            return next(err);
        }
        else{
            err = new Error('comment' + req.params.commentid + 'not found');
            err.status = 404;
            return next(err);
        }
    }
    else
    {
        err = new Error('you are not authorized');
        err.status = 403;
        return next(err);
    }
    },(err) => {console.log(err)})
    .catch((err) => {console.log(err)})
})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
    dishes.findById(req.params.dishid)
    .then((dish) => {
        var author = dish.comments.id(req.params.commentid).author;
        if((req.user._id).equals(author))
        {
        if((dish != null) && (dish.comments.id(req.params.commentid)) != null)
        {
        dish.comments.id(req.params.commentid).remove();
        dish.save()
        .then((dish) => {
            dishes.findById(dish._id)
            .populate('comments.author')
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            });
        },(err) => {next(err)})
        }
        else if(dish == null)
        {
            err = new Error('Dish' + req.params.dishid + 'not found');
            err.status = 404;
            return next(err);
        }
        else{
            err = new Error('comment' + req.params.commentid + 'not found');
            err.status = 404;
            return next(err);
        }
    }
    else
    {
        err = new Error('you are not authorized');
        err.status = 403;
        return next(err);
    }
    },(err) => {console.log(err)})
    .catch((err) => {console.log(err)})
});
module.exports=dishRouter;