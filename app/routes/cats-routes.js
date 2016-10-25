var express = require("express");
// use express built-in router
var router = express.Router();
// get local mongoose model
/*
 * Remark!
 * MongoDB wil automatically create collection named 'cats'
 * when we put any data through api
 */
var Cat = require("../models/cat");

// process routes api/cats/
router.route("/")
// get all cats (GET http://localhost:3000/api/cats)
.get(function(req, res) {
  Cat.find(function(err, cats) {
    if (err) res.send(err);
    res.json(cats);
  });
})
// create a cat (POST http://localhost:3000/api/cats)
.post(function(req, res) {
  Cat.create({
    name: req.body.name,
    age: req.body.age,
    breed: req.body.breed
  }, function(err, cat) {
    if (err) res.send(err);
    // return updated list with new dog
    Cat.find(function(err, cats) {
      if (err) res.send(err);
      res.json(cats);
    });
  });
});

// process routes api/dogs/:dog_id
router.route("/:cat_id")
// get a dog by id (GET http://localhost:3000/api/cats/cat_id)
.get(function(req, res) {
  Cat.findById(req.params.cat_id, function(err, cat) {
    if (err) res.send(err);
    // found a cat!
    res.json(cat);
  });
})
// update cat info (PUT http://localhost:3000/api/cats/cat_id)
.put(function(req, res) {
  Cat.findById(req.params.cat_id, function(err, cat) {
    if (err) res.send(err);
    cat.name = req.body.name;
    cat.age = req.body.age;
    cat.breed = req.body.breed;
    cat.save(function(err) {
      if (err) res.send(err);
      // return updated cat
      res.json(cat);
    });
  });
})
// delete cat (DELETE http://localhost:3000/api/cats/cat_id)
.delete(function(req, res) {
  Cat.remove({
    _id: req.params.cat_id
  }, function(err, cat) {
    if (err) res.send(err);
    // delete success!
  })
});

module.exports = router;
