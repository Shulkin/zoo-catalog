var mongoose = require("mongoose");

// define a dog schema
var DogSchema = new mongoose.Schema({
  // MongoDB will automatically generate an _id
  name: String,
  age: Number,
  breed: String
});

module.exports = mongoose.model("Dog", DogSchema);
