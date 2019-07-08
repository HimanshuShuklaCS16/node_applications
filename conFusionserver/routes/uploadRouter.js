const express =  require("express");
const bodyParser = require("body-parser");
var authenticate = require('../authenticate');
const multer = require('multer');
const cors = require('./cors');
const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null,'public/images');
    },
    filename:(req,file,cb) => {
        cb(null,file.originalname);
    }
});

const imagefilefilter = (req,file,cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
        return cb(new Error('You can upload only image files !!'),false);
    }
    return cb(null,true);

}
const upload = multer({storage : storage,fileFilter : imagefilefilter});
const uploadRouter = express.Router();
uploadRouter.use(bodyParser.json());

uploadRouter.route('/')
.options(cors.corsWithOptions,(req,res) => {
    res.sendStatus(200);
})
.get(cors.cors,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    res.statusCode = 403;
    res.end("get operation not allowed on /imageUpload");
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,upload.single('File'),(req,res) => {
    res.statusCode =200;
    res.setHeader('content-Type','application/json');
    res.json(req.file);
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    res.statusCode = 403;
    res.end("put operation not allowed on /imageUpload");
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    res.statusCode = 403;
    res.end("delete operation not allowed on /imageUpload");
})

module.exports=uploadRouter;