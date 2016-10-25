var mongoose = require("mongoose");

// define a cat schema
var CatSchema = new mongoose.Schema({
  // MongoDB will automatically generate an _id
  name: String,
  age: Number,
  breed: String
});

module.exports = mongoose.model("Cat", CatSchema);
