angular.module("dogs.mock", [])
// define some constant values
.value("NAMES", [
  "John", "Google", "Klaus", "Kevin",
  "Math", "David", "Missy", "Doge"
])
.value("BREEDS", [
  "Afghan Hound", "Akbash", "Akita Inu", "English Springer Spaniel",
  "Finnish Spitz", "Olde English Bulldogge", "Papillon", "Pug"
])
// inject them in out mock factory
.factory("DogsMock", function(NAMES, BREEDS) {
  return {
    createList: function(count) {
      var result = [];
      // define random int function
      function random(min, max) {
        var rand = min + Math.random() * (max + 1 - min);
        rand = Math.floor(rand);
        return rand;
      }
      for (var i = 0; i < count; i++) {
        var obj = {
          name: NAMES[random(0, NAMES.length - 1)],
          age: random(1, 20),
          breed: BREEDS[random(0, BREEDS.length - 1)]
        };
        result.push(obj);
      }
      return result;
    }
  }
});
