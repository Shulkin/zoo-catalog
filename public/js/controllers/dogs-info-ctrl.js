angular.module("dogs.info.ctrl", [])
.controller("DogsInfoCtrl", function(Dogs) {
  var vm = this;
  Dogs.get(Dogs.getSelectedId())
  .success(function(dog) {
    vm.name = dog.name;
    vm.age = dog.age;
    vm.breed = dog.breed;
  })
  .error(function(err) {
    console.log("Error " + err);
  });
});
