/*
 * It's important!
 * We need to inject this module with all necessary controllers
 * and services
 */
var zooApp = angular.module("zoo.app", [
  "ui.router", // external Angular UI-Router
  "angularModalService", // simple modal dialog by dwmkerr
  "zoo.routes", // application states
  // modal controller
  "modal.ctrl",
  // small utils
  "utilities",
  // dogs controllers
  "dogs.ctrl",
  "dogs.info.ctrl",
  // dogs services
  "dogs.service",
  "dogs.mock"
]);
