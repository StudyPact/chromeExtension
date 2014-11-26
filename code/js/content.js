;(function() {
  console.log('CONTENT SCRIPT WORKS!');

  var $ = require('./libs/jquery');
  //var msg = require('./modules/bus/msg');

  console.log('jQuery version:', $().jquery);
})();
