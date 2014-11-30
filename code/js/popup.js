'use strict';

;(function() {
  var $ = require('./libs/jquery');
  console.log('POPUP SCRIPT WORKS!');
  $(document).ready(function() {
    $('#submit').click(function(){
      console.log("test");
    });
  });

})();