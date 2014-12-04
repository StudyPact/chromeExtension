var ChromeBus = {};
var messageHandlerMapping = {};

/*
  This class behaves similar to an eventEmitter
  wrapped around the chrome messaging bus. You can even
  use callbacks as the last parameter

  ex1:
  bus.on("message", function(data){
    console.log(data); 
  });
  bus.emit("message", {"awesome":"data"})

  ex2:
  bus.on("giveMeMore", function(callback){
    callback({"awesome":"data"});
  })
  bus.emit("giveMeMore", function(data){
    console.log(data);
  })
 */
ChromeBus.on = function(message, handler) {
  var wrapper = function(request,sender,sendResponse) {
    if (request.message === message) {
      if (sendResponse){
        request.data.push(sendResponse);
      }
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
  var last;
  if (args[args.length-1] instanceof Function){
    last = args.pop();
  }
  var content = {
    data: args,
    message: message
  };
  if (last){
    chrome.runtime.sendMessage(content, last);
  }
  else{
    chrome.runtime.sendMessage(content);
  }
};


module.exports = ChromeBus;