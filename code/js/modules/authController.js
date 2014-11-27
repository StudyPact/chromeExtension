var Q = require("q");

var AuthController = {};
var accessToken;
var config = require("./config");

AuthController.getAccessToken = function() {
  if (accessToken){
    return new Q(accessToken);
  }
  var query = {
    url: config.webapp_url,
    name: "accessToken"
  }; 
  console.log("COOKIE Query:", query);
  var deferred = Q.defer();
  chrome.cookies.get(query, deferred.resolve);
  deferred.promise.then(function(cookie){
    accessToken=cookie;
    console.log("COOKIE", cookie);
  });
  return deferred.promise;
};

AuthController.boot = function() {};

AuthController.shutdown = function() {};

module.exports = AuthController;