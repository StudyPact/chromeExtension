var $ = require('../libs/jquery');
var AuthController = require("./authController");

var OptionsController = {};


function logout() {
  AuthController.logout()
    .then(function() {
      console.log("Successfully Logged Out");
      window.close();
    });
}

function setupLogoutButton() {
  $('#logoutButton').off("click");
  $('#logoutButton').click(logout);
}

OptionsController.boot = function() {
  AuthController.boot();
  setupLogoutButton();
};

OptionsController.shutdown = function() {
};

module.exports = OptionsController;
