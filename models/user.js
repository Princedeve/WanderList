const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
   email: {
      type: String,
      required: true,
      unique: true
   }
   //passport js username or password autometicaly create karega 
});

userSchema.plugin(passportLocalMongoose);


module.exports = mongoose.model("User", userSchema);
