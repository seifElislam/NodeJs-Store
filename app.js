var express = require('express');
var flash=require("connect-flash");
var bcrypt=require("bcrypt");
var mongoose=require("mongoose");
var fs=require("fs");
mongoose.connect("mongodb://localhost:27017/Store");


// Load ORM Layer
// Get all files under modeld folders
// Then require
fs.readdirSync(__dirname+"/models").forEach(function(file){
  require("./models/"+file);
})
//cookie-parser
var session=require("express-session");
var server=express();

var authRouter=require("./controllers/auth");
//var homeRouter=require("./controllers/home");
var productsRouter = require('./controllers/products');
// Add Session Middleware
var sessionMiddleware=session({
  secret:"#@$@#%$^&",
  //cookie:{maxAge:60*60*24*7}
})
// flash Middleware
server.use(flash());
server.use(sessionMiddleware);
// For each request "Check session data" and set response Locals
server.use(function(request,response,next){
  var loggedIn=request.session.loggedIn;
  var username=request.session.username;
  var img=request.session.img;
  response.locals={loggedIn:loggedIn,username:username,img:img}
  next();
})
server.use(express.static('static'));
server.use('/products',productsRouter);
server.use("/auth",authRouter);
//server.use("/home",homeRouter);

server.use('/home',function(request,response){
  var title="Open Source store"
  //var users=[{name:"user1"},{name:"user2"},{name:"user3"}]
  //response.render("users/list",{myTitle:title,myUsers:users});
  // response.locals={
  //   myTitle:title,
  //   //myUsers:users,
  //   pageTitle:"Home page"
  // }
  response.render("home/home");
});
server.set('view engine','ejs');
server.set('views','./views');
server.listen(8090);
