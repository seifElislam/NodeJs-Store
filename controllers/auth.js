var express=require("express");
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var bcrypt=require("bcrypt");
var multer=require("multer");
//var uploadFileMiddleware=multer({dest:__dirname+"/../static/uploads"});
 var uploadFileMiddleware=multer({dest:__dirname+"/../static/uploads",
 fileFilter:function(request,file,cb){
   if(file.mimetype=="image/jpeg" ||file.mimetype=="image/png" ){
     request.fileStatus="file uploaded";
     cb(null,true);
   }else{
     request.fileStatus="file not uploaded";
     cb(null,false);
   }

 }})

var postRequestMiddleware=bodyParser.urlencoded({extended:false});
var router=express.Router();
//------------------------------------------------------------
//login
router.get("/login",function(request,response){
  // only to display view ..
  response.render("auth/login",{message:request.flash("message")})
})

router.post("/login",postRequestMiddleware,function(request,response){
  // check username & password "using DB"
  console.log(request.body);
  var target;
  if(request.body.email!=""&&request.body.password!=""){
    mongoose.model("users").find({email:request.body.email},function(err,user){
      //console.log(request.session.username);

      target=user[0];
      console.log("target :",target);
      if(bcrypt.compareSync(request.body.password,user[0].password)){
        // Store Data on Session ...
        request.session.loggedIn=true;
        request.session.username=user[0].username;
        request.session.img=user[0].avatar;
        response.redirect("/products")
      }else{
        // flash Messgae
        request.flash("message","Invalid username & password");
        response.redirect("/auth/login")
      }
    })
  }
})
//----------------------------------------------------------
//register
router.get("/register",function(request,response){
  response.render("auth/register",{message:request.flash("message")})
})

// router.post("/register",uploadFileMiddleware.single("avatar"),function(request,response){
//   console.log(request.file);
//   // Save New employees
//   var UserModel=mongoose.model("users");
//   var salt=bcrypt.genSaltSync();
//   var hashedPassword=bcrypt.hashSync(request.body.password,salt)
//   var user=new UserModel({name:request.body.username,password:hashedPassword,avatar:request.file.filename,email:request.body.email});
//   user.save(function(err){
//     if(!err){
//       response.redirect("/home");
//     }else{
//       response.send("Error");
//     }
//   })
//
// })
// var validate=function(request,response){
//   if(request.body.password == request.body.password2){
//     if(request.body.username!=""&&request.body.password!=""&&request.body.email!=""){
//       // Save New user
//       var UserModel=mongoose.model("users");
//       var salt=bcrypt.genSaltSync();
//       var hashedPassword=bcrypt.hashSync(request.body.password,salt)
//       //upload;
//       var user=new UserModel({name:request.body.username,password:hashedPassword,email:request.body.email,avatar:request.file.filename});
//       user.save(function(err){
//         if(!err){
//           response.redirect("/home");
//         }else{
//           response.send("Error");
//         }
//       })
//     }
//   }
//   else {
//     request.flash("message","Fill all fields");
//     response.redirect("/auth/register")
//   }
// }
//router.post("/register",function(request,response,next){ validate(request,response),next()},uploadFileMiddleware.single("avatar"))

//var upload=uploadFileMiddleware.single("avatar");


 router.post("/register",postRequestMiddleware,uploadFileMiddleware.single("avatar"),function(request,response){
   //console.log("request :"+request.body);
   if(request.body.password == request.body.password2){
     if(request.body.username!=""&&request.body.password!=""&&request.body.email!=""){
       // Save New user
       var UserModel=mongoose.model("users");
       var salt=bcrypt.genSaltSync();
       var hashedPassword=bcrypt.hashSync(request.body.password,salt)
       //upload;
       var user=new UserModel({username:request.body.username,password:hashedPassword,email:request.body.email,avatar:request.file.filename});
       user.save(function(err){
         if(!err){
           request.session.loggedIn=true;
           request.session.username=request.body.username;
           request.session.img=request.file.filename;
           response.redirect("/products");
         }else{
           response.send("Error");
         }
       })
     }
   }
   else {
     request.flash("message","Fill all fields");
     response.redirect("/auth/register")
   }


 })
//----------------------------------------------------------------
//logout
router.get("/logout",function(request,response){
  // destroy session..
  request.session.destroy();
  // back to browser with code "302" and New Location
  // Browser send new request to "New Location.."
  response.redirect("/home")
})
//-----------------------------------------------------------------
module.exports=router;
