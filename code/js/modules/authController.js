var AuthController = {};

AuthController.getAccessToken = function(callback) {
  var query = {
    url: "http://studypact-webapp-test.herokuapp.com",
    name: "accessToken"
  };
  chrome.cookies.get(query, callback);
};

AuthController.boot = function() {};

AuthController.shutdown = function() {};

module.exports = AuthController;