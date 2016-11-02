angular.module("dogs.info.ctrl", [])
.controller("DogsInfoCtrl", function(Dogs, $stateParams) {
  var vm = this;
  // init params with empty string
  [vm.name, vm.age, vm.breed] = ["", "", ""]
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
});
