angular.module("dogs.info.ctrl", [])
.controller("DogsInfoCtrl", function(Dogs, $stateParams) {
  var vm = this;
  // receive dogs id from url
  var id = $stateParams.id;
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
