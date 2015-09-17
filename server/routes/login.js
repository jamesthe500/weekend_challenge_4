var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');


// does not apply to me?
router.get("/", function(req,res,next){
    console.log('working in router.get on login.js');
    res.sendFile(path.resolve(__dirname, '../views.users.html'));
});

// here is teh problem. The code comes here & has no problem with router.post as I put the register code within.
// something with passport.authenticate.
// in an express based application I need to run passport.initialize ? Nope, had done that.
// installed cookie-parser and app.used it. nope.

router.post('/', function(req,res,next) {
    console.log("Posting: ", req.body);
    passport.authenticate('local', {
        failureFlash: 'Invalid username or password.',
        successFlash: 'Welcome!',
        successRedirect: '/views/users.html',
        failureRedirect: '/views/failed.html'
    })
});


/* someone else's solution. Doesn't even work here- errors.
exports.login = [
    function(){
        console.log('Trying to log in!');
    },
    passport.authenticate('local', {
        successRedirect: '/views/users.html',
        failureRedirect: '/views/failed.html'
    })
];*/


module.exports = router;