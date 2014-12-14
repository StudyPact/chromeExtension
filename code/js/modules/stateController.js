var chromeBus = require("./lib/chromeBus");
var internalBus = require("./lib/simpleBus");
var authController = require("./authController");
var Q = require("q");

var systemState;

function StateController() {
  function newStudyEvent(studyEvent) {
    systemState.currentStudyEvent = studyEvent;
  }

  function endStudyEvent() {
    systemState.currentStudyEvent = null;
  }

  function loadState() {
    var deferred = Q.defer();
    var initialState = {
      active: true,
      studying: false,
      cookie: false,
      currentStudyEvent: null
    };
    authController.isLoggedIn().then(function(isLoggedIn){
      initialState.cookie=isLoggedIn;
      deferred.resolve(initialState);
    });
    return deferred.promise;
  }

  function sendState(callback) {
    console.log("received sendstate with callback");
    systemState.then(function(systemState){
      callback(systemState);
    });
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
  }

  function setupHooks() {
    chromeBus.on("state:update", handleStateUpdate);
    internalBus.on("state:request", sendState);
    chromeBus.on("studyevent:start", newStudyEvent);
    chromeBus.on("studyevent:end", endStudyEvent);

    systemState=loadState();
  }

  function removeHooks() {
    chromeBus.removeListener("state:update", handleStateUpdate);
    internalBus.removeListener("state:request", sendState);
    chromeBus.removeListener("studyevent:start", newStudyEvent);
    chromeBus.removeListener("studyevent:end", endStudyEvent);
  }

  this.boot = function() {
    setupHooks();
  };

  this.shutdown = function() {
    removeHooks();
  };
}

module.exports = new StateController();
