// we have access to Dogs factory through main module
angular.module("dogs.ctrl", ["ngAnimate"]) // inject hgAnimate here
.config(function($animateProvider) {
  // disable animation in carousel
  $animateProvider.classNameFilter(/^(?:(?!ng-animation-disabled).)*$/);
})
.value("DogsPerPage", 12) // number of dogs per page
.controller("DogsCtrl", function(
  Dogs, DogsPerPage, DogsMock,
  Utils, ModalService, $timeout) {
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
  function animate(val) {
    vm.animate = val;
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
    animate(false); // disable animation
    Dogs.getAll()
    .success(function(data) {
      reload(data);
    })
    .error(function(err) {
      console.log("Error " + err);
    });
  }
  // create new dog
  function create(data) {
    Dogs.create(data)
    .success(function(data) {
      /* Enable animation to properly show
       * new item appears in list */
      animate(true);
      var lastPage = vm.pages.last();
      // create new page if necessary
      if (lastPage.length >= DogsPerPage) {
        vm.pages.push([]);
        lastPage = vm.pages.last();
      }
      // push new dog to last page
      // this will be animated slow fade
      lastPage.push(data.created.dog);
      /* Disable animation by timeout and just
       * force reload new list */
      $timeout(function () {
        animate(false);
        $timeout(function() {
          reload(data.list);
        }, 500); // after more 0.5s reload data
      }, 100); // enable animation after 0.1s
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
      /* The same, enable animation and do neat job */
      animate(true);
      var abort = false;
      // find deleted dog in list and show it slowly fade
      for (var i = 0; i < vm.pages.length; i++) {
        var page = vm.pages[i];
        for (var j = 0; j < page.length; j++) {
          if (data.deleted._id == page[j]._id) {
            page.splice(j, 1);
            abort = true;
            break;
          }
        }
        if (abort) break;
      }
      /* Then just screw it load a new list */
      $timeout(function () {
        animate(false);
        $timeout(function() {
          reload(data.list);
        }, 500);
      }, 100);
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
