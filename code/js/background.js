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

    var studyapps = studyAppController.getWebApps();
    studyapps.then(function(studyapps){
      console.log("retrieved studyapps:", studyapps);
    });
    studyapps.fail(function(error){
      console.error("studyapps error:", error);
    });
  } 

  init();

})();
