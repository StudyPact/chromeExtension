;(function() {

  console.log('BACKGROUND SCRIPT WORKS!');
  //var msg = require('./modules/bus/msg');
  var authController = require('./modules/authController');
  var activityTracker = require('./modules/activityTracker');

  function init(){
    authController.boot();
    activityTracker.boot();
  } 
 
  init();

})();
