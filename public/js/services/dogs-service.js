angular.module("dogs.service", [])
.factory("Dogs", function($http) {
  return {
    getAll: function() {
      return $http.get("/api/dogs");
    },
    get: function(id) {
      return $http.get("/api/dogs/" + id);
    },
    create: function(dogData) {
      return $http.post("/api/dogs", dogData);
    },
    update: function(id, dogData) {
      return $http.put("/api/dogs/" + id, dogData);
    },
    delete: function(id) {
      return $http.delete("/api/dogs/" + id);
    },
  }
});
