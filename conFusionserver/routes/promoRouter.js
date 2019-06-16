const express =  require("express");
const bodyParser = require("body-parser");
 
const promoRouter = express.Router();
promoRouter.use(bodyParser.json());

promoRouter.route('/promotions')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('content-Type','text/plain');
    next();
})
.get((req,res,next) => {
    res.end("will send all the promotions to you");
})
.post((req,res,next) => {
    res.end("will add promotion with name : " + req.body.name + " and description " + req.body.description);
})
.put((req,res,next) => {
    res.statusCode = 403;
    res.end("put operation not allowed on /promotions");
})
.delete((req,res,next) => {
    res.end("will delete all the promotions !!");
});

promoRouter.route('/promotions/:promoid')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('content-Type','text/plain');
    next();
})
.get((req,res,next) => {
    res.end("will get promo with id " + req.params.promoid);
})
.post((req,res,next) => {
    res.statusCode = 403;
    res.end("post operation not supported on /promotions/" + req.params.promoid);
})
.put((req,res,next) => {
    res.end("will update promo with id : " +req.params.promoid + "with name "+ req.body.name + " and description " + req.body.description);
})
.delete((req,res,next) => {
    res.end("deleting promo with id " + req.params.promoid);
});
module.exports=promoRouter;