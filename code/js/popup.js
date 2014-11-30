'use strict';

;(function() {
  var $ = require('./libs/jquery');
  console.log('POPUP SCRIPT WORKS!');
  $(document).ready(function() {
    $('#submit').click(function(){
      var email = $("#email").val();
      var password = $("#password").val();
      console.log(email);
      console.log(password);
      var request_data = {
        grant_type: "password",
        client_id: "ZxaoIsUoshMow5Dx",
        client_secret: "njNA842Msr6IVbyfO3X3Ag32Q66jl6IO",
        scope: "user",
        username: email,
        password: password
      };
      $.ajax({
        url: "https://studypact-rest-test.herokuapp.com/oauth/token",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(request_data)
      }).success(function(response){
        console.log(response);
      }).done(function(response){
        console.log(response);
      }).error(function(response) {
        console.log(response);
      });
    });
  });

})();