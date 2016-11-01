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
    // use 'controller as' notation for better code in html template
    controller: "DogsCtrl as dogs"
  })
  // nested view, dogs info
  .state("dogs.info", {
    url: "/:id",
    views: {
      "dogs-info": { // unique name to reference
        templateUrl: "./views/dogs-info.html",
        controller: "DogsInfoCtrl as dog"
      }
    }
  });
}]);
