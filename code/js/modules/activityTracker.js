var Q = require("q");

var studyAppController = require("./studyAppController");

function ActivityTracker() {
  function getUrl() {
    var deferred = Q.defer();
    var query = {
      active: true,
      currentWindow: true
    };
    chrome.tabs.query(query, function(tab) {
      deferred.resolve(tab[0].url);
    });
    return deferred.promise;
  }

  function handleStateChange(state) {
    if (state === "idle") {
      chrome.browserAction.setIcon({
        path: "images/ic_not_studying.png"
      });
    } else {
      chrome.browserAction.setIcon({
        path: "images/icon.png"
      });
    }
    console.log("NEW STATE:", state);
  }

  function handleUserEvent() {
    var url = getUrl();
    var studyApp = studyAppController.findStudyAppsByUrl(url);
    studyApp.then(function(app){
      console.log("APP",app);
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