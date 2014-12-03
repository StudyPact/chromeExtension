var $ = require('../libs/jquery');
var AuthController = require("./authController");
var StudyAppController = require("./studyAppController");

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

function displayError(error) {
  $("#error").show();
  $("#error p").text(error);
}

function setupAddStudyAppButton() {
  $('#addStudyAppSubmit').off("click");
  $('#addStudyAppSubmit').click(function() {
    var app = {

    };
    StudyAppController.addStudyApp(app)
    .then(function(){
      console.log("Successfully sent studyApp");
      window.close();
    })
    .fail(function(error){
      console.warn("Failed to send app:", error);
      displayError("Could not login, please try again");
    });

  });
}

function setupLoginButton() {
  $('#loginSubmit').off("click");
  $('#loginSubmit').click(function() {
    var email = $("#email").val();
    var password = $("#password").val();
    AuthController.login(email,password)
    .then(function(){
      console.log("Successfully Logged In");
      window.close();
    })
    .fail(function(error){
      console.warn("Failed to log in:", error);
      displayError("Could not login, please try again");
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
  setupAddStudyAppButton();
};

LoginFormController.shutdown = function() {};

module.exports = LoginFormController;
