var chromeBus = require("./lib/chromeBus");
var internalBus = require("./lib/simpleBus");

var systemState = {};

function IconController() {

  function storeInitialState(state){
    console.log("handling initial state:", state);
    systemState=state;
    updateIcon();
  }

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

    updateIcon();
  }

  function updateIcon(){
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
    chromeBus.on("state:update", handleStateUpdate);
    internalBus.emit("state:request", storeInitialState);
  }

  function removeHooks() {
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