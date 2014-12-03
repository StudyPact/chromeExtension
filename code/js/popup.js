'use strict';

;(function() {
  var $ = require('./libs/jquery');
  var PopupController = require('./modules/popup/popupController');
  
  $(document).ready(function() {
    PopupController.boot();
  });

})();