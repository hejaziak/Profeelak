var passport = require("passport");
var User = require("./models/user");

var LocalStrategy = require("passport-local").Strategy;

passport.use("login", new LocalStrategy( function(username, password, done) {

	User.findOne({ username: username }, function(err, user) {
	  if (!user) {
			return done(null, false,{ message: "No user has that username!" }); 
	  }
	  user.checkPassword(password, function(err, isMatch) {

	    if (isMatch) {
				return done(null, user);
	    } else {
	        return done(null, false,
					{ message: "Invalid password." }); 
	      }
		});
	});
}));

// serializeUser should turn a user object into an ID. You call done with no error and the user’s ID.
module.exports = function() {
	passport.serializeUser(function(user, done) {
    done(null, user._id);
	});

  // deserializeUser should turn the ID into a user object. Once you’ve finished, you call done with any errors and the user object.
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
	});
};