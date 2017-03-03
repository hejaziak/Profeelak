var mongoose = require("mongoose");
var Work = require("./works.js");
var mongoosePaginate = require('mongoose-paginate');

//Requiring bcrypt
var bcrypt = require("bcrypt-nodejs");
var SALT_FACTOR = 10;

var Schema = mongoose.Schema;

//Defining the user schema
var userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  profilePic: String,
  displayName: String,
  bio: String,
  works: [{ type: Schema.Types.ObjectId, ref: 'Work'}]
});


userSchema.methods.name = function() {
  return this.displayName || this.username;
};

userSchema.methods.profilePicture = function() {
  return this.profilePic;
};


var noop = function() {};

//Pre-save action to hash the password 
userSchema.pre("save", function(done) {
  var user = this;
  if (!user.isModified("password")) {
    return done();
  }

	bcrypt.genSalt(SALT_FACTOR, function(err, salt) { 
		if (err) { return done(err); } bcrypt.hash(user.password, salt, noop,
		function(err, hashedPassword) {
// ￼￼￼      	if (err) {
// 				 return done(err);
// 			}
      		user.password = hashedPassword;
      		done();
		});
	});
});

userSchema.plugin(mongoosePaginate);

//Checking the user’s password 
userSchema.methods.checkPassword = function(guess, done) {
  bcrypt.compare(guess, this.password, function(err, isMatch) {
    done(err, isMatch);
  });
};

//Creating and exporting the user model 
var User = mongoose.model("User", userSchema);

module.exports = User;