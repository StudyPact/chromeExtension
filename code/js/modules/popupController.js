var $ = require('../libs/jquery');
var AuthController = require("./authController");

var LoginFormController = {};
var state = {};

function displayLoginForm() {
  $("#addStudyAppForm").hide();
  $("#loginForm").show();
}

function displayRequestStudyAppForm() {
  $("#loginForm").hide();
  $("#addStudyAppForm").show();
}

function displayError() {
  console.log("what the hack?", $("#error p"));
  $("#error").show();
  $("#error p").text("Could not login, please try again");
}

function setupLoginButton() {
  $('#submit').off("click");
  $('#submit').click(function() {
    var email = $("#email").val();
    var password = $("#password").val();
    AuthController.login(email,password)
    .then(function(){
      console.log("Successfully Logged In");
      window.close();
    })
    .fail(function(error){
      console.warn("Failed to log in:", error);
      displayError();
    });

  });
}

LoginFormController.boot = function() {
  AuthController.boot();
  $("#loginForm").hide();
  $("#addStudyAppForm").hide();
  AuthController.isLoggedIn().then(function(loggedIn){
    console.log("retrieved logged in:", loggedIn);
    state.loggedIn=loggedIn;
    if (!state.loggedIn){
      displayLoginForm();
    }
    else{
      displayRequestStudyAppForm();
    }
  });
  setupLoginButton();
};

LoginFormController.shutdown = function() {};

module.exports = LoginFormController;
