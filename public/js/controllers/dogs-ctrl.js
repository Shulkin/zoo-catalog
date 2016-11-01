// we have access to Dogs factory through main module
angular.module("dogs.ctrl", ["ngAnimate"]) // inject hgAnimate here
.config(function($animateProvider) {
  // disable animation in carousel
  $animateProvider.classNameFilter(/^(?:(?!ng-animation-disabled).)*$/);
})
.value("DogsPerPage", 12) // number of dogs per page
.value("FadeDuration", 1000) // duration of animation, ms
.controller("DogsCtrl", function(
  Dogs, // dogs service
  DogsMock, // mock service to populate list with test data
  Utils, // utilities service
  ModalService, // modal windows
  // constants
  DogsPerPage,
  FadeDuration,
  // Angular objects
  $scope,
  $timeout) {
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
  // toggle animation on add/delete items in gallery
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
      // start animation with slight timeout
      $timeout(function() {
        // animation will last 1s (!)
        var lastPage = vm.pages.last();
        // create new page if necessary
        if (lastPage.length >= DogsPerPage) {
          vm.pages.push([]);
          lastPage = vm.pages.last();
        }
        /* Push new dog to last page.
         * It will be animated by slow fade */
        lastPage.push(data.created.dog);
      }, 100);
      /* Wait A LITTLE BIT MORE than 'FadeDuration' and then
       * disable animation and reload actual data from response */
      $timeout(function() {
        animate(false);
        $timeout(function() {
          reload(data.list);
        }, 200); // after more 200ms update list with actual data
      }, FadeDuration); // wait for animation and disable it
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
    //alert("delete a dog_" + id);
    Dogs.delete(id)
    .success(function(data) {
      //alert("delete success!");
      /* Enable animation and show item
       * slowly fade out */
      //alert("enable animation");
      animate(true);
      $timeout(function() {
        // animation will last 1s (!)
        var abort = false;
        //alert("start loop...");
        // find deleted dog by _id on page and splice it
        for (var i = 0; i < vm.pages.length; i++) {
          for (var j = 0; j < vm.pages[i].length; j++) {
            if (data.deleted._id == vm.pages[i][j]._id) {
              //alert("splice page_" + i + " at " + j);
              vm.pages[i].splice(j, 1);
              abort = true;
              break;
            }
          }
          if (abort) break;
        }
      }, 100)
      //alert("splice ended, start timeout...");
      /* Disable animation and reload list */
      $timeout(function() {
        //alert("waited for animation to end and disable animation");
        animate(false);
        $timeout(function() {
          //alert("wait 200ms more and reload list");
          reload(data.list);
        }, 200);
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
