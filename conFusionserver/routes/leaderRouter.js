const express =  require("express");
const bodyParser = require("body-parser");
 
const leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());

leaderRouter.route('/leaders')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('content-Type','text/plain');
    next();
})
.get((req,res,next) => {
    res.end("will send all the leaders to you");
})
.post((req,res,next) => {
    res.end("will add leader with name : " + req.body.name + " and description " + req.body.description);
})
.put((req,res,next) => {
    res.statusCode = 403;
    res.end("put operation not allowed on /leaders");
})
.delete((req,res,next) => {
    res.end("will delete all the leaders !!");
});

leaderRouter.route('/leaders/:leaderid')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('content-Type','text/plain');
    next();
})
.get((req,res,next) => {
    res.end("will get leader with id " + req.params.leaderid);
})
.post((req,res,next) => {
    res.statusCode = 403;
    res.end("post operation not supported on /leaders/" + req.params.leaderid);
})
.put((req,res,next) => {
    res.end("will update leader with id : " +req.params.leaderid + "with name "+ req.body.name + " and description " + req.body.description);
})
.delete((req,res,next) => {
    res.end("deleting leader with id " + req.params.leaderid);
});
module.exports=leaderRouter;