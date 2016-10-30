// we have access to Dogs factory through main module
angular.module("dogs.ctrl", [])
.value("DogsPerPage", 12) // constant value. number of dogs per page
.controller("DogsCtrl", function(Dogs, DogsPerPage, DogsMock, Utils, ModalService) {
  /*
   * Better use 'this' instead of $scope, for several reasons.
   * But you need to declare 'this' as variable first, because 'this' in
   * handler functions is not the same as 'this' in DogsCtrl main body
   */
  var vm = this; // store 'this' in 'vm' variable
  // === Private ===
  function split(data) {
    // up to 12 dogs on one page
    return Utils.split(data, DogsPerPage);
  }
  // create new dog
  function create(data) {
    Dogs.create(data)
    .success(function(data) {
      // 'this' here is not the same as 'this' in DogsCtrl main body
      vm.pages = split(data); // so, use 'vm'
    })
    .error(function(err) {
      console.log("Error " + err);
    });
  };
  // === Constructor ===
  Dogs.getAll()
  .success(function(data) {
    // create test mock list with many random dogs
    data = DogsMock.createList(100); // rewrite data
    // divide dogs list to pages
    vm.pages = split(data);
  })
  .error(function(err) {
    console.log("Error " + err);
  });
  // === Public ===
  // delete a dog
  vm.delete = function(id) {
    Dogs.delete(id)
    .success(function(data) {
      vm.pages = split(data);
    })
    .error(function(err) {
      console.log("Error " + err);
    });
  };
  // show create dog dialog
  vm.openDialog = function() {
    // use third-party service to open modal
    ModalService.showModal({
      templateUrl: "../views/create-dialog.html",
      controller: "ModalCtrl as dialog",
      inputs: {
        title: "Add a new dog"
      }
    }).then(function(modal) {
      modal.element.modal();
      modal.close.then(function(result) {
        // result.data is an object with new dogs params
        if (result.success === true) { // if dialog not canceled
          create(result.data);
        }
      });
    });
  };
});
