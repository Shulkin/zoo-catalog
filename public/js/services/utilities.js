angular.module("utilities", [])
.factory("Utils", function() {
  return {
    split: function(array, n) {
      var res = [];
      while (array.length) {
        res.push(array.splice(0, n));
      }
      return res;
    }
  };
});
