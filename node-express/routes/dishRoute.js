const express =  require("express");
const bodyParser = require("body-parser");
 
const dishRouter = express.Router();
dishRouter.use(bodyParser.json());

dishRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('content-Type','text/plain');
    next();
})
.get((req,res,next) => {
    res.end("will send all the dishes to you");
})
.post((req,res,next) => {
    res.end("will add dish with name : " + req.body.name + " and description " + req.body.description);
})
.put((req,res,next) => {
    res.statusCode = 403;
    res.end("put operation not allowed on /dishes");
})
.delete((req,res,next) => {
    res.end("will delete all the dishes !!");
});
module.exports=dishRouter;