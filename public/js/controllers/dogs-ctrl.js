// we have access to Dogs factory through main module
angular.module("dogs.ctrl", [])
.controller("DogsCtrl", function(Dogs, DogsMock, ModalService) {
  /*
   * Better use 'this' instead of $scope, for several reasons.
   * But you need to declare 'this' as variable first!
   */
  var vm = this; // view model
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
  // keep it as a private function inside controller
  function create(data) {
    Dogs.create(data)
    .success(function(data) {
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
  };
  // show modal dialog
  vm.openDialog = function() {
    // use third-party service to open simple modal dialog
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
        if (result.success === true) { // if not canceled dialog
          create(result.data);
        }
      });
    });
  };
});
