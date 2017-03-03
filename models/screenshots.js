var mongoose = require("mongoose");
var User = require("/Users/Hejazi/Desktop/sa/models/user.js");
var Work = require("/Users/Hejazi/Desktop/sa/models/works.js");

var Schema = mongoose.Schema;

var screenshotSchema = new Schema({
			work : { type: Schema.Types.ObjectId, ref: 'Work'},
            image: String,
});

screenshotSchema.methods.path = function() {
  return this.image;
};

var Screenshot = mongoose.model("Screenshot", screenshotSchema);
module.exports = Screenshot;