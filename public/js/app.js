/*
 * It's important!
 * We need to inject this module with all necessary controllers
 * and services
 */
var zooApp = angular.module("zooApp", [
  "ui.router",
  "zooRoutes",
  "dogsCtrlModule",
  "dogInfoCtrlModule",
  "dogsServiceModule",
  "dogInfoServiceModule"
]);
