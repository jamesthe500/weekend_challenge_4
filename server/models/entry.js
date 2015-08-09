var mongoose = require('mongoose');

var EntrySchema = new mongoose.Schema({
    name : String,
    answer : String

});

module.exports = mongoose.model("entry", EntrySchema);