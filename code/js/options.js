'use strict';

;(function() {
  var $ = require('./libs/jquery');
  var optionsController = require('./modules/optionsController');

  $(document).ready(function() {
    optionsController.boot();
  });
})();
