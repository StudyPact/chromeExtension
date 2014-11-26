function ActivityTracker() {
  function getUrl(callback) {
    var query = {
      active: true,
      currentWindow: true
    };
    chrome.tabs.query(query, function(tab) {
      callback(tab[0].url);
    }); 
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

  function handleTabUpdated(tabId, changeInfo, tab) {
    if (tab && tab.active) {
      getUrl(function(url) {
        console.log("TAB UPDATED:", url);
      });
    }
  }

  function handleTabCreated(tabId, changeInfo, tab) {
    if (tab && tab.active) {
      getUrl(function(url) {
        console.log("TAB CREATED:", url);
      });
    }
  }

  function handleTabActivated() {
    getUrl(function(url) {
      console.log("TAB ACTIVATED:", url);
    });
  }

  function handleWindowFocusChange() {
    getUrl(function(url) {
      console.log("WINDOWS FOCUS CHANGED:", url);
    });
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