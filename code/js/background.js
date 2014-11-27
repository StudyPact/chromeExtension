;(function() {

  console.log("BACKGROUND SCRIPT WORKS!");
  //var msg = require("./modules/bus/msg");
  var authController = require("./modules/authController");
  var activityTracker = require("./modules/activityTracker");
  var studyAppController = require("./modules/studyAppController");

  function init(){
    authController.boot();
    activityTracker.boot();
    studyAppController.boot();
  } 

  init();

})();
