/*
 * It's important!
 * We need to inject this module with all necessary controllers
 * and services
 */
var zooApp = angular.module("zoo.app", [
  "ui.router", // external Angular UI-Router
  "zoo.routes", // application states
  // dogs controllers
  "dogs.ctrl",
  "dogs.info.ctrl",
  // dogs services
  "dogs.service"
]);
