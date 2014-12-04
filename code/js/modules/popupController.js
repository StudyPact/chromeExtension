var $ = require('../libs/jquery');
var Q = require("q");
var urlparse = require("url");

var AuthController = require("./authController");
var StudyAppController = require("./studyAppController");
var ChromeTools = require("./chromeTools");

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
    var url = ChromeTools.getCurrentUrl();
    var title = ChromeTools.getCurrentTitle();
    Q.all([url,title]).then(function(result){
      var url = result[0];
      var title = result[1];
      console.log("received:", url, title);
      var host = urlparse.parse(url).hostname;
      var app = {
        website_urls:[host],
        name: title
      };
      return StudyAppController.addStudyApp(app);
    })
    .then(function(result){
      console.log("Successfully sent studyApp",result);
    })
    .fail(function(error){
      console.warn("Failed to send app:", error);
      displayError("Error occured. Please try again");
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
