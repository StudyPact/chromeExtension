;(function() {

  console.log("BACKGROUND SCRIPT WORKS!");
  //var msg = require("./modules/bus/msg");
  var authController = require("./modules/authController");
  var activityTracker = require("./modules/activityTracker");
  var studyAppController = require("./modules/studyAppController");
  var studyEventController = require("./modules/studyEventController");
  var iconController = require("./modules/iconController");

  function init(){
    authController.boot();
    activityTracker.boot();
    studyAppController.boot();
    studyEventController.boot();
    iconController.boot();
  } 

  init();

})();
