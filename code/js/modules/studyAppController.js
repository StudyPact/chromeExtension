var Q = require("q");
var _ = require("underscore");
var $ = require("../libs/jquery");
var urlparse = require("url");

var authController = require("./authController");
var config = require("./config");

var StudyAppController = {};

StudyAppController.loadWebApps = function() {
  var token = authController.getAccessToken();
  var deferred = Q.defer();
  var jqueryPromise = $.ajax({
    type: "GET",
    url: config.host + "/api/studyapps?flags.web=true",
    headers: {
      "accessToken": token.get("value"),
      "version": config.apiVersion
    },
  });
  deferred.resolve(jqueryPromise);
  return deferred.promise;
};

var studyApps = StudyAppController.loadWebApps();

StudyAppController.getWebApps = function() {
  return new Q(studyApps);
};

var studyAppsDict=studyApps.then(function(studyApps){
  var deferred = Q.defer();
  var dict = {};
  _.each(studyApps, function(studyapp) {
    _.each(studyapp.website_urls, function(url){
      dict[url] = studyapp;
    });
  });
  console.log("Build app dict:",dict);
  deferred.resolve(dict);
  return deferred.promise;
});

StudyAppController.findStudyAppsByUrl = function(url) {
  var deferred = Q.defer();
  url.then(function(url){
    console.log("got URL", url);
    var parsedUrl = urlparse.parse(url);
    console.log("HOST:", parsedUrl.hostname);
    deferred.resolve(studyAppsDict.get(parsedUrl.hostname));
  });
  return deferred.promise;
};


StudyAppController.boot = function() {};

StudyAppController.shutdown = function() {};

module.exports = StudyAppController;