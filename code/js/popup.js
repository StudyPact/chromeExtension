'use strict';

;(function() {
  var $ = require('./libs/jquery');
  var PopupController = require('./modules/popupController');
  
  $(document).ready(function() {
    PopupController.boot();
  });

})();