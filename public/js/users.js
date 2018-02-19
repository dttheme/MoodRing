'use strict';


// SIGN UP

$('.sign_up_submit').click(function(event) {
  event.preventDefault();
  newUser();
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
      // console.log(jqXHR);
      // console.log(exception);
    }
  })
}

function newUser() {
  let firstName = $('input[id="firstName"]').val();
  let email = $('input[id="email"]').val();
  let password = $('input[id="password"]').val();
  postNewUser(firstName, email, password);
  authUser(email, password);
}


// LOGIN

function authUser(email, password) {
  let xhr = new XMLHttpRequest();
  let data = {
    email: email,
    password: password
  }
  let stringData = JSON.stringify(data);

  xhr.open('POST', '/auth/login', true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      let response = xhr.responseText;
      console.log(response);
    }
  };
  xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
  console.log(stringData);
  xhr.send(stringData);
}

$('.login_submit').click(function(event) {
  event.preventDefault();
  newUser();
})
