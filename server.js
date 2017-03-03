// Requires everything you need, including Mongoose
var express = require("express");
var mongoose = require("mongoose");
var path = require("path");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var flash = require("connect-flash");
var passport = require("passport");
var multer = require("multer");
var path = require('path');

//Requiring Passport setup 
var setUpPassport = require("./setuppassport");

// Puts all of your routes in another file
var routes = require("./routes/routes");
var workRoutes = require("./routes/workRoutes");
var app = express();


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));

//Connects to your MongoDB server in the test database
mongoose.connect("mongodb://localhost:27017/test3");

setUpPassport();

app.set("port", 3000);

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

//Uses four middlewares
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(session({
  secret: "TKRv0IJs=HYqrvagQ#&!F!%V]Ww/4KiVs$s,<<MX",
  resave: true,
  saveUninitialized: true
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use(routes);
app.use(workRoutes);



app.listen(app.get("port"), function() {
  console.log("Server started on port " + app.get("port"));
});