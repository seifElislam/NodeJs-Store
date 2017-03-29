var mongoose=require("mongoose")
var Schema=mongoose.Schema;

var users=new Schema({
  username:String,
  email:String,
  password:String,

  avatar:String
})
// Register ORM Layer..
mongoose.model("users",users);
