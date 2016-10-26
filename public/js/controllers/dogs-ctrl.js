// we have access to Dogs factory through main module
angular.module("dogs.ctrl", [])
.controller("DogsCtrl", function(Dogs) {
  /*
   * Better use 'this' instead of $scope, for several reasons
   */
  // init object to store new data when adding a dog
  this.formData = {};
  // when landing on page, load all dogs and show them
  Dogs.getAll()
  .success(function(data) {
    // populate dogs list
    this.list = data;
  })
  .error(function(err) {
    console.log("Error " + err);
  });
  // create new dog
  this.createDog = function() {
    Dogs.create(this.formData)
    .success(function(data) {
      this.formData = {}; // clear formData
      this.list = data; // update list with new dog
    })
    .error(function(err) {
      console.log("Error " + err);
    })
  };
  // delete a dog
  this.deleteDog = function(id) {
    Dogs.delete(id)
    .success(function(data) {
      this.list = data;
    })
    .error(function(err) {
      console.log("Error " + err);
    })
  }
})
