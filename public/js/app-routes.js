angular.module("zoo.routes", []).config(
  ["$stateProvider", "$urlRouterProvider",
  function($stateProvider, $urlRouterProvider) {
  // all other routes will lead to /home
  $urlRouterProvider.otherwise("/home");
  $stateProvider
  // home page state
  .state("home", {
    url: "/home",
    templateUrl: "./views/home.html"
  })
  // list of dogs
  .state("dogs", {
    url: "/dogs",
    templateUrl: "./views/dogs.html",
    controller: "DogsCtrl"
  })
  // nested view, dogs info
  .state("dogs.info", {
    url: "/dog-info",
    templateUrl: "./views/dogs-info.html",
    controller: "DogsInfoCtrl"
  });
}]);