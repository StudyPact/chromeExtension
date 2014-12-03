var Q = require("q");
var _ = require("underscore");
var $ = require("../libs/jquery");
var urlparse = require("url");

var authController = require("./authController");
var config = require("./config");

var StudyAppController = {};
var studyApps, studyAppsDict;

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
  deferred.promise.then(function() {
    studyApps = deferred.promise;
  });
  return deferred.promise;
};

StudyAppController.addStudyApp = function(app) {
  return authController.getAccessToken()
    .then(function(token) {
      return new Q($.ajax({
        type: "POST",
        url: config.host + "/api/studyapps",
        headers: {
          "accessToken": token,
          "version": config.apiVersion
        },
        data: JSON.stringify(app),
        contentType: "application/json",
      }));
    });
};

StudyAppController.findStudyAppsByUrl = function(url) {
  var deferred = Q.defer();
  url.then(function(url) {
    var parsedUrl = urlparse.parse(url);
    deferred.resolve(studyAppsDict.get(parsedUrl.hostname));
  });
  return deferred.promise;
};

studyApps = StudyAppController.loadWebApps();

studyAppsDict = studyApps.then(function(studyApps) {
  var deferred = Q.defer();
  var dict = {};
  _.each(studyApps, function(studyapp) {
    _.each(studyapp.website_urls, function(url) {
      dict[url] = studyapp;
    });
  });
  deferred.resolve(dict);
  return deferred.promise;
});

StudyAppController.boot = function() {};

StudyAppController.shutdown = function() {};

module.exports = StudyAppController;
