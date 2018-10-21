// Importing required modules
var mongoose = require("mongoose");
var User = require("/Users/Hejazi/Desktop/sa/models/user.js");
var Work = require("/Users/Hejazi/Desktop/sa/models/works.js");

// Initializing mongoose
var Schema = mongoose.Schema;

// Defining the schema
var screenshotSchema = new Schema({
			work : { type: Schema.Types.ObjectId, ref: 'Work'},
            image: String,
});

// Functionality
screenshotSchema.methods.path = function() {
  return this.image;
};

var Screenshot = mongoose.model("Screenshot", screenshotSchema);
module.exports = Screenshot;