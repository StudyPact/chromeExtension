'use strict';

;(function() {
  var $ = require('./libs/jquery');
  var popupController = require('./modules/popupController');
  var authController = require("./modules/authController");
  var studyAppController = require("./modules/studyAppController");

  $(document).ready(function() {
    popupController.boot();
    authController.boot();
    studyAppController.boot();
  });

})();