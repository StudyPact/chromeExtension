var Q = require("q");
var $ = require("../libs/jquery");

var authController = require("./authController");
var config = require("./config");

var StudyAppController = {};

StudyAppController.getWebApps = function() {

  var token = authController.getAccessToken();
  console.log("TOKEN", token);
  var deferred = Q.defer();
  var jqueryPromise = $.ajax({
    type: "GET",
    url: config.host + "/api/studyapps?flags.web=true",
    headers: {
      "accessToken": token.get("value"),
      "version": config.apiVersion
    },
  });
  console.log("build jquery promise:", jqueryPromise);
  deferred.resolve(jqueryPromise);
  return deferred.promise;
};

StudyAppController.boot = function() {};

StudyAppController.shutdown = function() {};

module.exports = StudyAppController;