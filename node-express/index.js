const express=require("express");
const http=require("http");
const hostname="localhost";
const port=3000;
const app=express();
const morgan=require("morgan");
const bodyParser = require("body-parser");
const dishRouter = require("./routes/dishRoute");

app.use('/dishes',dishRouter);


app.all('/dishes/:dishid',(req,res,next) => {
    res.statusCode = 200;
    res.setHeader('content-Type','text/plain');
    next();
});
app.get('/dishes/:dishid',(req,res,next) => {
    res.end("will get dish with id " + req.params.dishid);
});
app.post('/dishes/:dishid',(req,res,next) => {
    res.statusCode = 403;
    res.end("post operation not supported on /dishes/" + req.params.dishid);
});
app.put('/dishes/:dishid',(req,res,next) => {
    res.end("will update dish with id : " +req.params.dishid + "with name "+ req.body.name + " and description " + req.body.description);
});
app.delete('/dishes/:dishid',(req,res,next) => {
    res.end("deleting dish with id " + req.params.dishid);
});


app.use(morgan('dev'));
app.use(express.static(__dirname + "/public"));
app.use((req,res,next) => {
res.statusCode=200;
res.setHeader('content-Type','text/html');
res.end(`<html><body><h1>this is an express server</h1></body></html>`);
});
const server=http.createServer(app);
server.listen(port,hostname,() => {
    console.log(`server running at ${hostname}:${port}`);
});