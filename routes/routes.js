
var express = require("express");
var User = require("/Users/Hejazi/Desktop/sa/models/user.js");
var Works = require("/Users/Hejazi/Desktop/sa/models/works.js");
var Screenshot = require("/Users/Hejazi/Desktop/sa/models/screenshots.js");
var passport = require("passport");
var multer = require("multer");
var fs = require("fs");
var path = require('path');
var mongoosePaginate = require('mongoose-paginate');
var paginate = require("paginate-array");
var _ = require('lodash');




var router = express.Router();



router.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.errors = req.flash("error");
  res.locals.infos = req.flash("info");
  next();
});

function getPaginatedItems(items, page) {
  var page = page || 1,
      per_page = 10,
      offset = (page - 1) * per_page,
      paginatedItems = items.slice(offset,offset + per_page);
  return {
    page: page,
    per_page: per_page,
    total: items.length,
    total_pages: Math.ceil(items.length / per_page),
    data: paginatedItems
  };
}


router.get("/page/:id", function(req, res, next) {

  User.find().populate("works").exec(function(err, users) {
      if (err) { return next(err); }

      var paginatedItems = getPaginatedItems(users,req.params.id);

      res.render("index", { users: paginatedItems.data , total: paginatedItems.total , pageSize:10 , pageCount: paginatedItems.total_pages  });
  });

});

router.get("/signup", function(req, res) {
  res.render("signup");
});

//body-parser adds the username and password to req.body.
router.post("/signup", function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;

  if (username.length ==0 || password.length==0) { 
    req.flash("error", "Please insert all fields");
      return res.redirect("/signup");
  }

//If you find a user, you should bail out because that username already exists.
User.findOne({ username: username }, function(err, user) {
    if (err) { return next(err); }
    if (user) {
      req.flash("error", "User already exists");
      return res.redirect("/signup");
    }
//Creates a new instance of the User model with the username and password
    var newUser = new User({
      username: username,
      password: password
    });

    newUser.save(next);
  });
 },passport.authenticate("login", {
  successRedirect: "/page/1",
  failureRedirect: "/signup",
  failureFlash: true 
}));

router.get("/users/:username", function(req, res, next) {

  Works.find().populate("screenshots").exec(function(err,works){

      User.findOne({ username: req.params.username }).populate("works").exec(function(err,user){
        if (err) { return next(err); }
        if (!user) { return next(404); }



        res.render("profile", { user: user });
      })

  })


});

router.get("/login", function(req, res) {
  res.render("login");
});

router.post("/login", passport.authenticate("login", {
successRedirect: "/page/1",
  failureRedirect: "/login",
  failureFlash: true
}));


router.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/page/1");
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
      req.flash("info", "You must be logged in to see this page.");
      res.redirect("/login");
  }
}


router.get("/edit", ensureAuthenticated, function(req, res) {
  res.render("edit");
});


//setting up the upload destination and name
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    callback(null,file.originalname);
  }
});

//setting up multer
var upload = multer({ storage: storage});


router.post("/edit", upload.single('userPhoto'),  function(req, res, next) {



  req.user.displayName = req.body.displayname;
  req.user.bio = req.body.bio;

  if(req.file){
    var file = req.file.filename;
    req.user.profilePic = file;
  }

  req.user.save(function(err) {
    if (err) {
      next(err);
      return;
    }

    req.flash("info", "Profile updated!");
    var goTo ="users/"+ req.user.username;
    res.redirect(goTo);
  }); 
});





module.exports = router;