var Q = require("q");
var $ = require('../libs/jquery');

var AuthController = {};
var config = require("./config");
var bus = require("./lib/chromeBus");

AuthController.saveToken = function(accessToken) {
  var deferred = Q.defer();
  var cookieData = {
    url: config.webapp_url,
    name: "accessToken",
    value: accessToken,
    expirationDate: new Date().getTime()
  };
  chrome.cookies.set(cookieData,deferred.resolve);
  return deferred.promise;
};

AuthController.logout = function() {
  var deferred = Q.defer();
  var cookieData = {
    url: config.webapp_url,
    name: "accessToken",
    value: "",
    expirationDate: new Date().getTime(0)
  };
  chrome.cookies.set(cookieData,deferred.resolve);
  deferred.promise.then(function(){
    bus.emit("state:update", "noCookie");
  });
  return deferred.promise;
};

AuthController.login = function(email, password) {
  var request_data = {
    grant_type: "password",
    client_id: config.client_id,
    client_secret: config.client_secret,
    scope: "user",
    username: email,
    password: password
  };
  var jqueryPromise = new Q($.ajax({
    url: config.host+"/oauth/token",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(request_data)
  }));

  return jqueryPromise.then(function(response){
    var token = response.access_token;
    console.log("Received Token:", token);
    return AuthController.saveToken(token)
    .then(function(){
      console.log("Emitting status:update hasCookie");
      bus.emit("state:update", "hasCookie");
    });
  });
};

AuthController.isLoggedIn = function() {
  var deferred = Q.defer();
  AuthController.getAccessToken()
  .then(function(){
    deferred.resolve(true);
  })
  .fail(function(){
    deferred.resolve(false);
  });

  return deferred.promise;
};

AuthController.getAccessToken = function() {
  var query = {
    url: config.webapp_url,
    name: "accessToken"
  };
  var deferred = Q.defer();
  chrome.cookies.get(query, deferred.resolve);
  return deferred.promise.then(function(cookie) {
    if (cookie && cookie.value) {
      bus.emit("state:update", "hasCookie");
      return cookie.value;
    } else {
      bus.emit("state:update", "noCookie");
      throw new Error("Can't find Cookie");
    }
  });
};

AuthController.boot = function() {};

AuthController.shutdown = function() {};

module.exports = AuthController;
