var Q = require("q");

var AuthController = {};
var config = require("./config");
var bus = require("./lib/simpleBus");

AuthController.getAccessToken = function() {
  var query = {
    url: config.webapp_url,
    name: "accessToken"
  }; 
  console.log("COOKIE Query:", query);
  var deferred = Q.defer();
  chrome.cookies.get(query, deferred.resolve);
  deferred.promise.then(function(cookie){
    if(cookie.value){
      bus.emit("state:update", "hasCookie");
    }
    if(!cookie.value){
      bus.emit("state:update", "noCookie");
    }
  });
  return deferred.promise;
};

AuthController.boot = function() {};

AuthController.shutdown = function() {};

module.exports = AuthController;