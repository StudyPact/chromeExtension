var Q = require("q");

var ChromeTools = {};

var getCurrentTab = function() {
  var deferred = Q.defer();
  var query = {
    active: true,
    currentWindow: true
  };
  chrome.tabs.query(query, function(tab) {
    deferred.resolve(tab[0]);
  });
  return deferred.promise;

};

ChromeTools.getCurrentUrl = function() {
  var tab = getCurrentTab();
  return tab.then(function(tab) {
    return tab.url;
  });
};

ChromeTools.getCurrentTitle = function() {
  var tab = getCurrentTab();
  return tab.then(function(tab) {
    return tab.title;
  });
};


module.exports = ChromeTools;
