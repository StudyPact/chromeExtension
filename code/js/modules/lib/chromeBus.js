var ChromeBus = {};
var messageHandlerMapping = {};

ChromeBus.on = function(message, handler) {
  var wrapper = function(request) {
    if (request.message === message) {
      handler.apply(this,request.data);
    }
  };
  if (!messageHandlerMapping[message]){
    messageHandlerMapping[message]={};
  }
  messageHandlerMapping[message][handler] = wrapper;
  chrome.extension.onMessage.addListener(wrapper);
};

ChromeBus.removeListener = function(message, handler) {
  chrome.extension.onMessage.removeListener(messageHandlerMapping[message][handler]);
};

ChromeBus.emit = function(message) {
  var args = Array.prototype.slice.call(arguments, 1);
  var content = {
    data: args,
    message: message
  };
  chrome.runtime.sendMessage(content);
};


module.exports = ChromeBus;