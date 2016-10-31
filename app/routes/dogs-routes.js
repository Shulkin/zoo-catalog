var express = require("express");
// use express built-in router
var router = express.Router();
// get local mongoose model
/*
 * Remark!
 * MongoDB wil automatically create collection named 'dogs'
 * when we put any data through api
 */
var Dog = require("../models/dog");

// process routes api/dogs/
router.route("/")
// get all dogs (GET http://localhost:3000/api/dogs)
.get(function(req, res) {
  Dog.find(function(err, dogs) {
    if (err) res.send(err);
    res.json(dogs);
  });
})
// create a dog (POST http://localhost:3000/api/dogs)
.post(function(req, res) {
  Dog.create({
    name: req.body.name,
    age: req.body.age,
    breed: req.body.breed
  }, function(err, dog) {
    if (err) res.send(err);
    res.json(dog); // new dog
  });
});

// process routes api/dogs/:dog_id
router.route("/:dog_id")
// get a dog by id (GET http://localhost:3000/api/dogs/dog_id)
.get(function(req, res) {
  Dog.findById(req.params.dog_id, function(err, dog) {
    if (err) res.send(err);
    res.json(dog); // found a dog!
  });
})
// update dog info (PUT http://localhost:3000/api/dogs/dog_id)
.put(function(req, res) {
  Dog.findById(req.params.dog_id, function(err, dog) {
    if (err) res.send(err);
    dog.name = req.body.name;
    dog.age = req.body.age;
    dog.breed = req.body.breed;
    dog.save(function(err) {
      if (err) res.send(err);
      res.json(dog); // updated dog
    });
  });
})
// delete dog (DELETE http://localhost:3000/api/dogs/dog_id)
.delete(function(req, res) {
  Dog.remove({
    _id: req.params.dog_id
  }, function(err, dog) {
    if (err) res.send(err);
    res.json(dog); // deleted dog
  })
});

module.exports = router;
