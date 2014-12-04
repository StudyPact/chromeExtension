var $ = require('../libs/jquery');
var Q = require("q");
var urlparse = require("url");
var _ = require("underscore");

var AuthController = require("./authController");
var StudyAppController = require("./studyAppController");
var ChromeTools = require("./chromeTools");

var bus = require("./lib/chromeBus");

var LoginFormController = {};
var state = {};

function display(id) {
  var divs = ["addStudyAppForm", "loginForm", "studyStatus"];
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
        console.log("received:", url, title);
        var host = urlparse.parse(url).hostname;
        var app = {
          website_urls: [host],
          name: title
        };
        return StudyAppController.addStudyApp(app);
      })
      .then(function(result) {
        console.log("Successfully sent studyApp", result);
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

function handleStateUpdate(stateChange) {
  console.log("Icon Controller:", stateChange);
  if (stateChange === "studying") {
    display("studyStatus");
  }
  if (stateChange === "notStudying") {
    display("addStudyAppForm");
  }
}

function storeInitialState(initialState) {
  console.log("storeInitialState called", initialState);
  state = initialState;
  if (!state.cookie) {
    display("loginForm");
  } else {
    if (state.studying) {
      display("studyStatus");
    } else {
      display("addStudyAppForm");
    }
  }
}

LoginFormController.boot = function() {
  AuthController.boot();
  display();
  setupLoginButton();
  setupAddStudyAppButton();

  bus.emit("state:request", storeInitialState);
  bus.on("state:update", handleStateUpdate);
};

LoginFormController.shutdown = function() {
  bus.removeListener("state:update", handleStateUpdate);
};

module.exports = LoginFormController;
