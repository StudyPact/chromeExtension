var bus = require("./lib/chromeBus");

var systemState = {
  active: true,
  studying: false,
  cookie: true,
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
    bus.on("state:update", handleStateUpdate);
    bus.on("state:request", sendState);
    bus.on("studyevent:start", newStudyEvent);
    bus.on("studyevent:end", endStudyEvent);
  }

  function removeHooks() {
    bus.removeListener("state:update", handleStateUpdate);
    bus.removeListener("state:request", sendState);
    bus.removeListener("studyevent:start", newStudyEvent);
    bus.removeListener("studyevent:end", endStudyEvent);
  }

  this.boot = function() {
    setupHooks();
  };

  this.shutdown = function() {
    removeHooks();
  };
}

module.exports = new StateController();