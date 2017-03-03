var mongoose = require("mongoose");
var User = require("./user.js");

var Schema = mongoose.Schema;

var workSchema = new Schema({
	
			username : { type: Schema.Types.ObjectId, ref: 'User'},
            name: { type: String, required: true },
            link: String,
            info: String,
            screenshots: [ String ]
            
});

var Work = mongoose.model("Work", workSchema);
module.exports = Work;