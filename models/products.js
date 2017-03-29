var mongoose=require("mongoose")
var Schema=mongoose.Schema;

var products=new Schema({
  name:String,
  price:String,
  description:String,
  owner:String,
  avatar:String
})
// Register ORM Layer..
mongoose.model("products",products);
