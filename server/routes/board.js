var express = require('express');
var router = express.Router();
var path = require('path');
var Entry = require('../models/entry');

router.post("/", function(req, res, next){
    console.log('post hit: ', req.body);
    Entry.create(req.body, function(err, post){
        res.send('yes');
    });
});

router.delete("/:id", function(req, res, next){
    Entry.findByIdAndRemove(req.params.id, req.body, function(err, whatdel){
        if(err){
            console.log("Error: ", err);
        }
        res.json(whatdel);
    });
});

router.get("/", function(req, res, next){
    /*console.log(res.json.length);
    console.log(res.json);
    console.log("that was entry");*/
    Entry.find(function(err, entry){
       res.json(entry);
    }).sort({_id: 1});
});

module.exports = router;