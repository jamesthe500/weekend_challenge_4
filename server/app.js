var express = require("express");
var path = require("path");

var mongoose = require('mongoose');

var app = express();

var board = require('./routes/board');
var index = require('./routes/index');

var questions = require('./public/data/questions');

/*var clickers = require('./public/assets/scripts/clickers');*/ //what's teh point of mdule exports again?
/*mongodb://jamesthe500:55126aFormerWorkZip@ds031183.mongolab.com:31183/message_board*/
// mongodb://localhost/<database>
var mongoURI = "mongodb://jamesthe500:55126aFormerWorkZip@ds031183.mongolab.com:31183/message_board";
var mongoDB = mongoose.connect(mongoURI).connection;

mongoDB.on('error', function(err){
    if(err){
        console.log("mongo error: ", err);
    }
});

/*console.log(clickers.clickNorm());*/

mongoDB.once('open', function(){
    console.log("connected to monog!");
});

var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({expanded:true}));

app.set("port", (process.env.PORT || 5000));

app.use('/board', board);
app.use("/", index);

app.get('/data', function(req, res){
    res.json(questions);
});

app.listen(app.get("port"), function(){
   console.log("Listening on port: " + app.get("port"));
});