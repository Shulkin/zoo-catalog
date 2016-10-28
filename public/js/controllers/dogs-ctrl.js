// we have access to Dogs factory through main module
angular.module("dogs.ctrl", [])
.controller("DogsCtrl", function(Dogs, DogsMock, ModalService, Utils, $timeout) {
  /*
   * Better use 'this' instead of $scope, for several reasons.
   * But you need to declare 'this' as variable first!
   */
  var vm = this; // view model
  // === Private ===
  // split to pages
  function splitPages(data) {
    // up to 11 dogs on one page
    return Utils.split(data, 11);
  }
  // create new dog
  function create(data) {
    Dogs.create(data)
    .success(function(data) {
      /*
       * Important notice!
       * Use of vm here insted of 'this' is mandatory! 'this' here is not the
       * same as in DogsCtrl main body.
       */
      vm.pages = splitPages(data);
    })
    .error(function(err) {
      console.log("Error " + err);
    });
  };
  // === Constructor ===
  Dogs.getAll()
  .success(function(data) {
    // create test mock list with many random dogs
    data = DogsMock.createList(100);
    // divide dogs list to pages, up to 11 dogs on one page
    vm.pages = splitPages(data);
    // set first page by default
    vm.changePage(0);
  })
  .error(function(err) {
    console.log("Error " + err);
  });
  // === Public ===
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
        if (result.success === true) { // if dialog not cancel
          create(result.data);
        }
      });
    });
  };
  // change page in gallery
  vm.changePage = function(index) {
    /*
     * We are starting to change page in gallery.
     * Order of actions is very important here!
     */
    //First, activate fade-out animation by $scope.fading=false
    vm.fading = false;
    // Next, set $scope.pageIndex, it will switch the button in pagination
    vm.pageIndex = index; // selected page
    // Next, set the actual change of data in page on timeout
    $timeout(function() {
      // Change the data
      vm.currentPage = vm.pages[index];
      // At last, switch the animation to fade-in again
      vm.fading = true;
      // page will be shown in animation with new data
    }, 500); // 500ms is enough
  };
});
