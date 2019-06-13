const express=require("express");
const http=require("http");
const hostname="localhost";
const port=3000;
const app=express();
const morgan=require("morgan");

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