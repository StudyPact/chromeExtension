'use strict';

;(function() {
  var $ = require('./libs/jquery');
  var LoginFormController = require('./modules/popup/loginFormController');
  
  $(document).ready(function() {
    LoginFormController.boot();
  });

})();