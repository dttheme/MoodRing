'use strict';

$('.sign_up_submit').click(function(event) {
  event.preventDefault();
  addNewUser();
})

function postNewUser(firstName, email, password) {
  $.ajax({
    url: '/users',
    type: 'POST',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(
      {
      firstName: firstName,
      email: email,
      password: password
    }
  ),
    success: function(data) {
      if(data) {
        console.log(data);
      }
    },
    error: function(jqXHR, exception) {
      console.log(jqXHR);
      console.log(exception);
    }
  })
}

function addNewUser() {
  let firstName = $('input[id="firstName"]').val();
  let email = $('input[id="email"]').val();
  let password = $('input[id="password"]').val();
  postNewUser(firstName, email, password);
}









$('login_submit').click(function(event) {

})
