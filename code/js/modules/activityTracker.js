var studyAppController = require("./studyAppController");
var studyEventController = require("./studyEventController");
var chromeTools = require("./chromeTools");
var bus = require("./lib/chromeBus");

var userState={
  active:true,
  studyapp:null,
};
function ActivityTracker() {
  function handleStateChange(state) {
    var userActive;
    if (state === "idle") {
      userActive=false;
      bus.emit("state:update", "userIdle");
    } else {
      userActive=true;
      bus.emit("state:update", "userActive");
    }
    if (userState.active!==userActive){
      userState.active=userActive;
      studyEventController.handleUserStateChange(userActive);
    }
  }

  function handleUserEvent() {
    var url = chromeTools.getCurrentUrl();
    var studyApp = studyAppController.findStudyAppsByUrl(url);
    studyApp.then(function(app){
      var previousApp = userState.studyapp;
      if (previousApp!==app){
        studyEventController.handleStudyAppChange(app);
        userState.studyapp=app;
      }
    });
  }

  function handleTabUpdated(tabId, changeInfo, tab) {
    if (tab && tab.active) {
      console.log("TAB UPDATED");
      handleUserEvent();
    }
  }

  function handleTabCreated(tabId, changeInfo, tab) {
    if (tab && tab.active) {
      console.log("TAB CREATED");
      handleUserEvent();
    }
  }

  function handleTabActivated() {
    console.log("TAB ACTIVATED");
    handleUserEvent();
  }

  function handleWindowFocusChange() {
    console.log("WINDOWS FOCUS CHANGED");
    handleUserEvent();
  }

  function setupHooks() {
    chrome.windows.onFocusChanged.addListener(handleWindowFocusChange);
    chrome.tabs.onActivated.addListener(handleTabActivated);
    chrome.tabs.onCreated.addListener(handleTabCreated);
    chrome.tabs.onUpdated.addListener(handleTabUpdated);
    chrome.idle.onStateChanged.addListener(handleStateChange);
    chrome.idle.setDetectionInterval(15);
  }

  function removeHooks() {
    chrome.windows.onFocusChanged.removeListener(handleWindowFocusChange);
    chrome.tabs.onActivated.removeListener(handleTabActivated);
    chrome.tabs.onCreated.removeListener(handleTabCreated);
    chrome.tabs.onUpdated.removeListener(handleTabUpdated);
    chrome.idle.onStateChanged.removeListener(handleStateChange);
  }

  this.boot = function() {
    setupHooks();
  };

  this.shutdown = function() {
    removeHooks();
  };

  return this;
}

module.exports = new ActivityTracker();