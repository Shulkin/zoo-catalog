angular.module("dogs.info.ctrl", [])
.controller("DogsInfoCtrl", function(Dogs, $stateParams) {
  var vm = this;
  // init params with empty string
  [vm.name, vm.age, vm.breed] = ["", "", ""]
  // default edit flags for inputs
  vm.edit = {};
  [vm.edit.name, vm.edit.age, vm.edit.breed] = [false, false, false];
  // receive dogs id from url
  var id = $stateParams.id;
  // find dog by id and fill params
  Dogs.get(id)
  .success(function(dog) {
    vm.name = dog.name;
    vm.age = dog.age;
    vm.breed = dog.breed;
  })
  .error(function(err) {
    console.log("Error " + err);
  });
  // === Public ===
  vm.startEdit = function(val) {
    // turn on input
    vm.edit[val] = true;
  };
  vm.submit = function(val) {
    // submit all data
    var data = {
      name: vm.name,
      age: vm.age,
      breed: vm.breed
    };
    Dogs.update(id, data)
    .success(function(dog) {
      vm.name = dog.name;
      vm.age = dog.age;
      vm.breed = dog.breed;
    })
    .error(function(err) {
      console.log("Error " + err);
    });
    // turn off input
    vm.edit[val] = false;
  };
});
