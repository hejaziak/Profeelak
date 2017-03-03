var mongoose = require("mongoose");
var User = require("/Users/Hejazi/Desktop/sa/models/user.js");
var Screenshot = require("/Users/Hejazi/Desktop/sa/models/screenshots.js");

var Schema = mongoose.Schema;

var workSchema = new Schema({
	
			username : { type: Schema.Types.ObjectId, ref: 'User'},
            name: { type: String, required: true },
            info: String,
            screenshots: [ String ]
            
});

var Work = mongoose.model("Work", workSchema);
module.exports = Work;