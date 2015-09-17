var express = require("express");
var path = require("path");

var mongoose = require('mongoose');

var app = express();

var passport = require('passport');
var session = require('express-session');
var localStrategy = require('passport-local').Strategy;

var board = require('./routes/board');
var index = require('./routes/index');

var User = require('./models/user');

var questions = require('./public/data/questions');

var register = require('./routes/register');
var login = require('./routes/login');

/*var clickers = require('./public/assets/scripts/clickers');*/ //what's teh point of mdule exports again?
/*mongodb://jamesthe500:55126aFormerWorkZip@ds031183.mongolab.com:31183/message_board*/
// mongodb://localhost/<database>
var mongoURI = "mongodb://localhost/testboard2";
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
var cookieParser = require('cookie-parser');

app.use(cookieParser());

app.use(session({
    secret: 'secret',
    key: 'user',
    resave: true,
    saveUninitialized: false,
    cookie: {maxAge: 60000, secure: false}
}));

app.use(passport.initialize());
app.use(passport.session());


/*passport.use('local', new localStrategy({ passReqToCallback : true,
        usernameField: 'username' },
    function(req, username, password, done) {
    }
));*/

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({expanded:true}));

app.set("port", (process.env.PORT || 5000));







// 2 changed user.id to user._id
passport.serializeUser(function(user, done){
    console.log("serialize, what's in user? " + user);
    done(null, user._id);
});

// 3 changed "id, function..." to "user.id, ..."
passport.deserializeUser(function(user, done){
    User.findById(user._id, function(err,user){
        if(err) done(err);
        done(null,user);
    });
});


passport.use('local', new localStrategy({
        passReqToCallback: true,
        usernameField: 'username'
    },
    function(req, username, password, done){
        User.findOne({ username: username }, function(err, user){
            if (err) throw err;
            if (!user) {
                return done(null, false, {message: 'Incorrect username and/or password.'});
            }


            // test a matching password
            user.comparePassword(password, function(err, isMatch){
                if (err) throw err;
                if(isMatch){
                    return done(null, user);
                }

                else {
                    return done(null, false, {message: 'Incorrect username and/or password.'});
                }
            });
        });
    }));

// swapped the next stock fro the one after it. ran the schema
app.post('/login', login);

// Ok, if successful, it redirects here. unsccessful goes over to login.js and uses that path? WTF?
// oh, I suppose it if it gets a failed res... that doesn't make sense.
app.post('/login', passport.authenticate('local'), function(req, res) {
    console.log(" then res " + req);
   /* console.log(req);*/
    console.log(res.data);
    res.redirect('/views/users.html');
});

app.get('/data', function(req, res){
    res.json(questions);
});

app.use('/register', register);
app.use('/board', board);
app.use("/", index);

app.listen(app.get("port"), function(){
    console.log("Listening on port: " + app.get("port"));
});

module.exports = app;