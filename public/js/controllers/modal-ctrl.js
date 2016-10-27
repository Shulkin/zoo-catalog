angular.module("modal.ctrl", [])
.controller("ModalCtrl", function($element, title, close) {
  var vm = this;
  // init params
  vm.name = null;
  vm.age = null;
  vm.breed = null;
  // show title
  vm.title = title;
  /*
   * This functions must use the bootstrap 'modal' function because
   * the corresponding buttons doesn't have the 'data-dismiss' attribute,
   * because of the weird modal fade bug
   */
  vm.close = function() {
    // make data validation here!
    /*
    */
    $element.modal('hide'); // manually hide the modal
    close({
      success: true,
      data: {
        name: vm.name,
        age: vm.age,
        breed: vm.breed
      }
    }, 500); // close, but give 500ms for bootstrap to animate
  };
  vm.cancel = function() {
    $element.modal('hide');
    close({}, 500); //empty close
  };
  /*
   * Kinda bad solution, because it throws error in dwmkerr module,
   * on 'cancel' and 'close' functions
   */
  $element.on('hidden.bs.modal', function () {
    // try to catch modal on hide and explicitly pass it as 'cancel'
    vm.cancel();
  })
});
