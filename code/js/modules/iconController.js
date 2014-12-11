var bus = require("./lib/chromeBus");

var state = {};

function IconController() {

  function handleStateUpdate(stateChange) {
    console.log("Icon Controller:", stateChange);
    if (stateChange === "noCookie") {
      state.cookie = false;
    }
    if (stateChange === "hasCookie") {
      state.cookie = true;
    }
    if (stateChange === "userIdle") {
      state.active = false;
    }
    if (stateChange === "userActive") {
      state.active = true;
    }
    if (stateChange === "studying") {
      state.studying = true;
    }
    if (stateChange === "notStudying") {
      state.studying = false;
    }

    if (state.cookie) {
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
    console.log("setLoggedInIcon", state);
    if (state.studying && state.active) {
      return setIcon("tracking");
    }
    if (state.studying && !state.active) {
      return setIcon("sleeping");
    }
    if (!state.studying) {
      return setIcon("login");
    }
  }

  function initializeState(initialState,a,b,c){
    console.log("received initialState:", initialState,a,b,c);
    state = initialState;
  }

  function setupHooks() {
    bus.on("state:update", handleStateUpdate);
  }

  function removeHooks() {
    bus.removeListener("state:update", handleStateUpdate);
  }

  this.boot = function() {
    setupHooks();
    console.log("sending state:request");
    bus.emit("state:request", initializeState);
  };

  this.shutdown = function() {
    removeHooks();
  };
}

module.exports = new IconController();