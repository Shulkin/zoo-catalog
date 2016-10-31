// we have access to Dogs factory through main module
angular.module("dogs.ctrl", ["ngAnimate"]) // inject hgAnimate here
.value("DogsPerPage", 12) // constant number of dogs per page
.controller("DogsCtrl", function(
  Dogs, DogsPerPage, DogsMock,
  Utils, ModalService) {
  /*
   * Better use 'this' instead of $scope, for several reasons.
   * But you need to declare 'this' as variable first, because 'this' in
   * handler functions is not the same as 'this' in DogsCtrl main body
   */
  var vm = this; // store 'this' in 'vm' variable
  // === Private ===
  vm.active = 0; // first page is active by default
  function split(data) {
    // split list on pages
    return Utils.split(data, DogsPerPage);
  }
  // create prototype function get last element in array
  Array.prototype.last = function() {
    return this[this.length-1];
  }
  // create new dog
  function create(data) {
    Dogs.create(data)
    .success(function(data) {
      //vm.pages = split(data);
      // Notice! 'this' here is not the same as 'this' in DogsCtrl main body
      var lastPage = vm.pages.last();
      // create new page if necessary
      if (lastPage.length >= DogsPerPage) {
        vm.pages.push([]);
        lastPage = vm.pages.last();
      }
      // push new dog to last place to properly animate it
      lastPage.push(data);
    })
    .error(function(err) {
      console.log("Error " + err);
    });
  };
  // === Constructor ===
  Dogs.getAll()
  .success(function(data) {
    // create test mock list with many random dogs
    //data = DogsMock.createList(100); // rewrite data
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
