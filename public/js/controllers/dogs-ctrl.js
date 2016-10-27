// we have access to Dogs factory through main module
angular.module("dogs.ctrl", [])
.controller("DogsCtrl", function(Dogs, DogsMock) {
  /*
   * Better use 'this' instead of $scope, for several reasons.
   * But you need to declare 'this' as variable first!
   */
  vm = this; // view model
  // init object to store new data when adding a dog
  vm.formData = {};
  // when landing on page, load all dogs and show them
  Dogs.getAll()
  .success(function(data) {
    /*
     * Important notice!
     * Use of vm here insted of 'this' is mandatory! 'this' here is not the
     * same as in DogsCtrl main body.
     */
    // populate dogs list
    vm.list = data;
    // create test mock list with many random dogs
    //vm.list = DogsMock.createList(100);
  })
  .error(function(err) {
    console.log("Error " + err);
  });
  // create new dog
  vm.create = function() {
    Dogs.create(vm.formData)
    .success(function(data) {
      vm.formData = {}; // clear formData
      vm.list = data; // update list with new dog
    })
    .error(function(err) {
      console.log("Error " + err);
    });
  };
  // delete a dog
  vm.delete = function(id) {
    Dogs.delete(id)
    .success(function(data) {
      vm.list = data;
    })
    .error(function(err) {
      console.log("Error " + err);
    });
  }
});
