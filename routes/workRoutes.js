var express = require("express");
var User = require("/Users/Hejazi/Desktop/sa/models/user.js");
var Work = require("/Users/Hejazi/Desktop/sa/models/works.js");
var Screenshot = require("/Users/Hejazi/Desktop/sa/models/screenshots.js");
var passport = require("passport");
var multer = require("multer");
var fs = require("fs");
var path = require('path');

var router = express.Router();

router.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.errors = req.flash("error");
  res.locals.infos = req.flash("info");
  next();
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
      req.flash("info", "You must be logged in to see this page.");
      res.redirect("/login");
  }
}

router.get("/create", ensureAuthenticated , function(req, res) {
  res.render("create");
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
var upload = multer({ storage: storage});

router.post("/create",upload.array('photos', 12), function(req, res, next) {

	var newWork = new Work({
		username: req.user,
  	name: req.body.name,
    info: req.body.info,
	});

      var list = [];

    for (var i = 0; i < req.files.length; i++) {

      list.push(req.files[i].filename);

    }; 

    for (var i = 0; i < list.length; i++) {
      newWork.screenshots.push(list[i]);
    };

  req.user.works.push(newWork);

  newWork.save(function(err) {
    if (err) {

      next(err);
      return;
    }
  }); 

  req.user.save(function(err) {
    if (err) {
      next(err);
      return;
    }


    req.flash("info", "Work created!");
    var goTo ="users/"+ req.user.username;
    res.redirect(goTo);
  }); 

});

router.get("/work/:name" , function(req, res) {

  User.find().populate("works").exec(function(err,user){
    Work.findOne({ name: req.params.name }).exec(function(err,result){
      if (err) { return next(err); }
     res.render("work",{ work: result , user: result.username});

    })
  }); 
});

router.get("/delete/:name", ensureAuthenticated , function(req, res) {

 Work.findOne({ name: req.params.name }).remove().exec(function(err,result){
      res.redirect("/page/1");
     }); 
});

router.get("/:name/update", ensureAuthenticated, function(req, res) {
  res.render("update",{ name:req.params.name });
});

function diff (a1, a2) {

    var a = [], diff = [];

    for (var i = 0; i < a1.length; i++) {
        a[a1[i]] = true;
    }

    for (var i = 0; i < a2.length; i++) {
        if (a[a2[i]]) {
            delete a[a2[i]];
        } else {
            a[a2[i]] = true;
        }
    }

    for (var k in a) {
        diff.push(k);
    }

    return diff;
};



router.post("/:name/update", upload.array('photos', 12), function(req, res) {

 Work.findOne({ name: req.params.name }).exec(function(err,result){
      result.name= req.body.name;
      result.info = req.body.info;

      var list = [];





    for (var i = 0; i < req.files.length; i++) {

      list.push(req.files[i].filename);

    }; 

    

      
    for (var i = 0; i < list.length; i++) {

      result.screenshots.push(list[i]);

    };  


    result.save();

    
    res.render("work",{work: result ,user:result.username});


     }); 

  
});













module.exports = router;