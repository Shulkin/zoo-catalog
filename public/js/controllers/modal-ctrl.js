angular.module("modal.ctrl", [])
.controller("ModalCtrl", function($element, title, close) {
  var vm = this;
  // === Private ===
  // init params
  vm.name = null;
  vm.age = null;
  vm.breed = null;
  // show title
  vm.title = title;
  // // check if string is empty or contain only white-spaces
  String.prototype.isEmpty = function() {
    return (this.length === 0 || !this.trim());
  };
  // === Public ===
  /*
   * This functions must use the bootstrap 'modal' function because
   * the corresponding buttons doesn't have the 'data-dismiss' attribute,
   * because of the weird modal fade bug
   */
  vm.close = function() {
    // make data validation
    // === old method with jQuery ===
    var formValid = true;
    $('input').each(function() { // look through all inputs
      // find parent form-groups
      var formGroup = $(this).parents(".form-group");
      var glyphicon = formGroup.find(".form-control-feedback");
      var input = formGroup.find(".form-control");
      if (this.checkValidity() && !input.val().isEmpty()) { // html5 validation by input.pattern
        formGroup.addClass("has-success").removeClass("has-error");
        glyphicon.addClass("glyphicon-ok").removeClass("glyphicon-remove");
      } else {
        formGroup.addClass("has-error").removeClass("has-success");
        glyphicon.addClass("glyphicon-remove").removeClass("glyphicon-ok");
        // if one element is invalid, whole form is invalid
        formValid = false;
      }
    });
    // === end ===
    if (formValid) { // if everything is ok
      $element.modal('hide'); // manually hide the modal
      close({
        success: true,
        data: {
          name: vm.name,
          age: vm.age,
          breed: vm.breed
        }
      }, 500); // close, but give 500ms for bootstrap to animate
    }
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
