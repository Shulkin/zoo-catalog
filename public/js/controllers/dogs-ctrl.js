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
  Array.prototype.isEmpty = function() {
    return this.length < 1;
  }
  Array.prototype.last = function() {
    return this[this.length - 1];
  }
  function split(data) {
    // split list on pages
    return Utils.split(data, DogsPerPage);
  }
  // init will be called on controller start
  function init() {
    vm.pages = [[]]; // create empty gallery
    vm.active = 0; // first page is active by default
    Dogs.getAll()
    .success(function(data) {
      vm.pages = split(data);
      if (vm.pages.isEmpty()) {
        vm.pages = [[]];
      }
    })
    .error(function(err) {
      console.log("Error " + err);
    });
  }
  // create new dog
  function create(data) {
    Dogs.create(data)
    .success(function(data) {
      // push new data to last page
      var lastPage = vm.pages.last();
      // create new page if necessary
      if (lastPage.length >= DogsPerPage) {
        vm.pages.push([]);
        lastPage = vm.pages.last();
      }
      lastPage.push(data);
    })
    .error(function(err) {
      console.log("Error " + err);
    });
  };
  // === Constructor ===
  init();
  // === Public ===
  // delete a dog
  vm.delete = function(id) {
    Dogs.delete(id)
    .success(function(data) {
      vm.pages = split(data);
      if (vm.pages.isEmpty()) {
        vm.pages = [[]];
      }
      //vm.pages = split(data);
      /*
      //==
      var abort = false;
      for (var i = 0; i < vm.pages.length; i++) {
        var page = vm.pages[i];
        for (var j = 0; j < page.length; j++) {
          if (data._id == page[j]._id) {
            page.splice(j, 1);
            if (page.isEmpty()) {
              if (i > 0) {
                vm.pages.splice(i, 1);
                vm.active = i - 1;
              } else {
                vm.pages.push([]);
              }
            }
            abort = true;
            break;
          }
        }
        if (abort) break;
      }
      //==
      for (var k = i; k < vm.pages.length; k++) {
        if (k < vm.pages.length - 1) {
          page = vm.pages[k];
          var nextPage = vm.pages[k + 1];
          page.push(nextPage.shift());
          if (nextPage.length < 1) {
            vm.pages.pop();
          }
        }
      }
      //==
      */
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
