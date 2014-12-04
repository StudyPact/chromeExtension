var bus = require("./lib/simpleBus");
var chromeBus = require("./lib/chromeBus");

var systemState = {
  active: true,
  studying: false,
  cookie: true
};

function IconController() {
  function handleStateUpdate(stateChange) {
    console.log("Icon Controller:", stateChange);
    if (stateChange === "noCookie") {
      systemState.cookie = false;
    }
    if (stateChange === "hasCookie") {
      systemState.cookie = true;
    }
    if (stateChange === "userIdle") {
      systemState.active = false;
    }
    if (stateChange === "userActive") {
      systemState.active = true;
    }
    if (stateChange === "studying") {
      systemState.studying = true;
    }
    if (stateChange === "notStudying") {
      systemState.studying = false;
    }

    if (systemState.cookie) {
      return setLoggedInIcon();
    } else {
      return setIcon("not_login");
    }

  }

  function setIcon(icon) {
    console.log("setIcon:", icon);
    chrome.browserAction.setIcon({
      path: "images/menubar/" + icon + ".png"
    });
  }

  function setLoggedInIcon() {
    console.log("setLoggedInIcon", systemState);
    if (systemState.studying && systemState.active) {
      return setIcon("tracking");
    }
    if (systemState.studying && !systemState.active) {
      return setIcon("sleeping");
    }
    if (!systemState.studying) {
      return setIcon("login");
    }
  }

  function setupHooks() {
    bus.on("state:update", handleStateUpdate);
    chromeBus.on("state:update", handleStateUpdate);
  }

  function removeHooks() {
    bus.removeListener("state:update", handleStateUpdate);
    chromeBus.removeListener("state:update", handleStateUpdate);
  }

  this.boot = function() {
    setupHooks();
  };

  this.shutdown = function() {
    removeHooks();
  };
}

module.exports = new IconController();