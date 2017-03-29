var express=require("express");
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var bcrypt=require("bcrypt");
var multer=require("multer");
//var uploadFileMiddleware=multer({dest:__dirname+"/../static/uploads"});
 var uploadFileMiddleware=multer({dest:__dirname+"/../static/uploads",
 fileFilter:function(request,file,cb){
   if(file.mimetype=="image/jpeg" ||file.mimetype=="image/png" ){
   console.log(request.body);
     request.fileStatus="file uploaded";
     cb(null,true);
   }else{
     request.fileStatus="file not uploaded";
     cb(null,false);
   }

 }})

var postRequestMiddleware=bodyParser.urlencoded({extended:false});
var router=express.Router();

router.get("/",function(request,response){
  var title="Open Source store"
  var userProducts=[];
  mongoose.model("products").find({owner:request.session.username},function(err,products){
    //console.log(request.session.username);

    userProducts=products;
    console.log("products :",userProducts);
    response.render("products/list",{
      myTitle:title,
      products:userProducts,
      pageTitle:"List products"
    });

  })
  //var products=JSON.parse(productsData);

  //var users=[{name:"user1"},{name:"user2"},{name:"user3"}]
  //response.render("users/list",{myTitle:title,myUsers:users});

})

router.get("/add",function(request,response){
  console.log( "owner :",request.session.username);
  var title="add product"
  var owner= request.session.username;
  //response.render("users/list",{myTitle:title,myUsers:users});
  // response.locals={
  //   myTitle:title,
  //   owner:owner,
  //   pageTitle:"new product"
  // }
  response.render("products/new",{myTitle:title,owner:owner,pageTitle:"new product"});
})

//--------
router.post("/add",uploadFileMiddleware.single("avatar"),function(request,response){
  console.log("owner :"+request.body.owner);

    if(request.body.name!=""&&request.body.price!=""&&request.body.desc!=""){
      // Save New user
      var ProductModel=mongoose.model("products");

      var product=new ProductModel({owner:request.body.owner,name:request.body.name,price:request.body.price,description:request.body.desc,avatar:request.file.filename});
      product.save(function(err){
        if(!err){
          response.redirect("/products");
        }else{
          response.send("Error");
        }
      })
    }

  else {
    request.flash("message","Fill all fields");
    response.redirect("/products/add")
  }


})
//--------
// router.post("/add",productMiddleware,function(request,response){
//   //response.json(request.body);
//   var productsData=fs.readFileSync(__dirname+"/../models/products.txt").toString();
//   var products=JSON.parse(productsData);
//   var newProduct=request.body;
//   console.log(newProduct);
//   console.log("list :"+products);
//   products.push(newProduct);
//   fs.writeFileSync(__dirname+"/../models/products.txt",JSON.stringify(products));
//   response.redirect("/products");
//
// })

router.get("/update/:name",function(request,response){
  var title="update product"
  var targetName= request.params.name;
  var target;
  mongoose.model("products").find({name:targetName},function(err,products){
    //console.log(request.session.username);

    target=products[0];
    console.log("target :",target);
    response.render("products/edit",{
      myTitle:title,
      target:target,
      pageTitle:"update product"
    });

  })

})


router.post("/update",postRequestMiddleware,uploadFileMiddleware.single("avatar"),function(request,response){
  console.log("edit",request.body);
  console.log("file:",request.file);
  if(request.file == undefined){
    console.log("no file");
    mongoose.model("products").update({"name":request.body.name},{$set:{"price":request.body.price,"description":request.body.desc}},{},function(err,data){})

    response.redirect("/products")
  }
  else if(request.file != undefined){
    console.log("with file");
    mongoose.model("products").update({name:request.body.name},{$set:{"price":request.body.price,"description":request.body.desc},"avatar":request.file.filename},{},function(err,data){})
    response.redirect("/products")

  }

else {
  request.flash("message","Fill all fields");
  response.redirect("/products/add")
}

})

router.get("/delete/:name",function(request,response){
  var name= request.params.name;
  mongoose.model("products").remove({"name":name},function(err,data){})
  response.redirect("/products");

})

router.post("/find",postRequestMiddleware,function(request,response){
  var title="find product"
  console.log("find :",request.body.name);
  var target;
  mongoose.model("products").find({name:request.body.name},function(err,products){
    //console.log(request.session.username);

    target=products[0];
    console.log("return :",target);
    response.render("products/find",{target});
  })

})

module.exports=router;
