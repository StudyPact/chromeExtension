var chromeBus = require("./lib/chromeBus");
var internalBus = require("./lib/simpleBus");

var systemState = {
  active: true,
  studying: false,
  cookie: false,
  currentStudyEvent:null
};

function StateController() {
  function newStudyEvent(studyEvent){
    systemState.currentStudyEvent=studyEvent;
  }

  function endStudyEvent(){
    systemState.currentStudyEvent=null;
  }

  function sendState(callback){
    console.log("received sendstate with callback");
    callback(systemState);
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