var Q = require("q");

var StudyEventController = {};
var authController = require("./authController");
var config = require("./config");
var $ = require("../libs/jquery");
var bus = require("./lib/chromeBus");

var userState = {
  active: true,
  studyapp: null,
  timeOffset: 0,
};

function getCurrentTimestampWithServerOffset() {
  return new Date().getTime();
}

var currentStudyEvent;

function sendStudyEvent(studyevent) {
  console.log("Sending StudyEvent", studyevent);

  var token = authController.getAccessToken();
  token.then(function(token){
    var deferred = Q.defer();
    var jqueryPromise = $.ajax({
      type: "POST",
      url: config.host + "/api/studyevents",
      headers: {
        "Authorization": "Bearer " + token,
        "version": config.apiVersion
      },
      data: JSON.stringify(studyevent),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
    });
    deferred.resolve(jqueryPromise);
    return deferred.promise;
  });
}

function startStudyEvent(studyApp) {
  console.log("Start study event", studyApp);
  if (!studyApp) {
    return;
  }
  currentStudyEvent = {
    start: getCurrentTimestampWithServerOffset(),
    studyapp: studyApp._id,
  };
  bus.emit("studyevent:start", currentStudyEvent);
}

function finishStudyEvent() {
  console.log("Finish study event");
  if (!currentStudyEvent) {
    return;
  }
  currentStudyEvent.end = getCurrentTimestampWithServerOffset();
  sendStudyEvent(currentStudyEvent);
  bus.emit("studyevent:end", currentStudyEvent);
  currentStudyEvent = null;
}

StudyEventController.handleUserStateChange = function(userActive) {
  console.log("User State Change", userActive);
  if (!userState.active && userActive) {
    if (userState.studyapp) {
      startStudyEvent(userState.studyapp);
    }
  }
  if (userState.active && !userActive) {
    finishStudyEvent();
  }
  userState.active = userActive;
};

StudyEventController.handleStudyAppChange = function(currentStudyApp) {
  console.log("Study App Change", currentStudyApp);
  if(currentStudyApp){
    bus.emit("state:update", "studying");
  }
  else{
    bus.emit("state:update", "notStudying");
  }
  finishStudyEvent();
  if (currentStudyApp && userState.active) {
    startStudyEvent(currentStudyApp);
  }
  userState.studyapp = currentStudyApp;
};

StudyEventController.boot = function() {};

StudyEventController.shutdown = function() {};

module.exports = StudyEventController;