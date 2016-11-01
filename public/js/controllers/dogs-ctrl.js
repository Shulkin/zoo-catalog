// we have access to Dogs factory through main module
angular.module("dogs.ctrl", [])
.value("DogsPerPage", 12) // number of dogs per page
.value("FadeDuration", 500) // duration of items fade, ms
.value("Delay", 100) // delay between toggle animation
.controller("DogsCtrl", function(
  Dogs, // dogs service
  DogsMock, // mock service to populate list with test data
  Utils, // utilities service
  ModalService, // modal windows
  // constants
  DogsPerPage,
  FadeDuration,
  Delay,
  // Angular $timeout
  $timeout,
  $scope,
  $state) {
  /*
   * Better use 'this' instead of $scope, for several reasons.
   * But you need to declare 'this' as variable first, because 'this' in
   * handler functions is not the same as 'this' in DogsCtrl main body
   */
  var vm = this; // store 'this' in 'vm' variable
  /* store state we are in...
   * I need it to show info container ONLY on .info states */
  $scope.$state = $state;
  // === Private ===
  Array.prototype.isEmpty = function() {
    return this.length < 1;
  }
  Array.prototype.last = function() {
    return this[this.length - 1];
  }
  // toggle gallery animation
  function animate(val, fn) {
    // $scope.animate will affect ng-class in items div
    vm.animate = val; // toggle
    /* call fn() handler with 100ms timeout
     * to make sure that change in ng-class applied */
    $timeout(function() {
      fn(); // call handler
    }, Delay);
  }
  // split list to pages
  function split(data) {
    return Utils.split(data, DogsPerPage);
  }
  // reload all pages from scratch data
  function reload(data) {
    vm.pages = split(data);
    if (vm.pages.isEmpty()) {
      vm.pages.push([]); // push one empty
    }
  }
  // call on start DogsCtrl
  function init() {
    vm.pages = [[]]; // one empty page
    vm.active = 0; // active by default
    /* disable animation AND after
     * 100ms get dogs data */
    animate(false, function() {
      Dogs.getAll()
      .success(function(data) {
        reload(data);
      })
      .error(function(err) {
        console.log("Error " + err);
      });
    });
  }
  // create new dog
  function create(data) {
    Dogs.create(data)
    .success(function(data) {
      /* enable animation and add dog to gallery */
      animate(true, function() {
        // fade-in animation will last 500ms
        var lastPage = vm.pages.last();
        // create new page if necessary
        if (lastPage.length >= DogsPerPage) {
          vm.pages.push([]);
          lastPage = vm.pages.last();
        }
        /* Push new dog to last page.
         * It will be animated by slow fade-in */
        lastPage.push(data.created.dog);
      });
      /* wait A LITTLE BIT MORE than 'FadeDuration' and then disable
       * animation and AFTER MORE 100ms reload actual data from response */
      $timeout(function() {
        animate(false, function() {
          reload(data.list);
        });
      }, FadeDuration);
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
      /* enable animation and splice dog from
       * current page, thus slowly fade it out */
      animate(true, function() {
        // fade-out animation will last 500ms
        var abort = false;
        // find deleted dog by _id on page and splice it
        for (var i = 0; i < vm.pages.length; i++) {
          for (var j = 0; j < vm.pages[i].length; j++) {
            if (data.deleted._id == vm.pages[i][j]._id) {
              // this will be animated by slow fade-out
              vm.pages[i].splice(j, 1);
              abort = true;
              break;
            }
          }
          if (abort) break;
        }
      });
      /* reload actual data after animation ends */
      $timeout(function() {
        animate(false, function() {
          reload(data.list);
        });
      }, FadeDuration);
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
