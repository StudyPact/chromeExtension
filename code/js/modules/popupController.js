var $ = require('../libs/jquery');
var Q = require("q");
var urlparse = require("url");
var _ = require("underscore");

var AuthController = require("./authController");
var StudyAppController = require("./studyAppController");
var ChromeTools = require("./chromeTools");

var LoginFormController = {};

function display(id) {
  var divs = ["addStudyAppForm", "loginForm", "studyStatus", "addedStudyApp"];
  _.each(divs, function(div) {
    if (div === id) {
      $("#" + div).show();
    } else {
      $("#" + div).hide();
    }
  });
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
    Q.all([url, title]).then(function(result) {
        var url = result[0];
        var title = result[1];
        var host = urlparse.parse(url).hostname;
        var app = {
          website_urls: [host],
          name: title
        };
        return StudyAppController.addStudyApp(app);
      })
      .then(function(result) {
        console.log("Successfully sent studyApp", result);
        display("addedStudyApp");
      })
      .fail(function(error) {
        console.warn("Failed to send app:", error);
        displayError("Error occured. Please try again");
      });
  });
}

function login() {
  var email = $("#email").val();
  var password = $("#password").val();
  AuthController.login(email, password)
    .then(function() {
      console.log("Successfully Logged In");
      window.close();
    })
    .fail(function(error) {
      console.warn("Failed to log in:", error);
      displayError("Could not login, please try again");
    });
}

function setupLoginButton() {
  $('#loginSubmit').off("click");
  $('#loginSubmit').click(login);

  $('.loginInput').keyup(function(e) {
    if (e.which !== 13) {
      return;
    }
    e.preventDefault();
    // Submit the form.
    login();
  });
}

function checkLogin(){
  AuthController.isLoggedIn().then(function(isLoggedIn){
    if(isLoggedIn){
      display("addStudyAppForm");
    }
    else{
      display("loginForm");
    }
  });
}

LoginFormController.boot = function() {
  AuthController.boot();
  display();
  setupLoginButton();
  setupAddStudyAppButton();

  checkLogin();
};

LoginFormController.shutdown = function() {
};

module.exports = LoginFormController;
