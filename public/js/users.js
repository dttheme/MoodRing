'use strict';


// SIGN UP

$('.sign_up_submit').click(function(event) {
  event.preventDefault();
  newUser();
})

function newUser() {
  let firstName = $('input[id="firstName"]').val();
  let username = $('input[id="username"]').val();
  let password = $('input[id="password"]').val();
  postNewUser(firstName, username, password);
}

function postNewUser(firstName, username, password) {
  $.ajax({
    url: '/users',
    type: 'POST',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(
      {
      firstName: firstName,
      username: username,
      password: password
    }
  ),
    success: (data) => {
      if(data) {
        console.log(data);
      }
    },
    error: (jqXHR, exception) => {}
  })
}


// LOGIN

$('.login_submit').click(function(event) {
  event.preventDefault();
  returningUser();
})

function returningUser() {
  let username = $('input[id="username"]').val();
  let password = $('input[id="password"]').val();
  postReturningUser(username, password);
}

function postReturningUser(username, password) {
  $.ajax({
    url: '/auth/login',
    type: 'POST',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(
      {
        username: username,
        password: password
      }
    ),
    success: (token) => {
      successToken(token);
    },
    error: (jqXHR, exception) => {}
  })
}

function successToken(token) {
  if(token) {
    localStorage.setItem('authToken', token.authToken);
    window.location.href = '/dashboard.html';
  }
}

// LOGOUT

$('.logout_button').click(function(event) {
  event.preventDefault();
  console.log('HEAR YE HEAR YE');
  logoutUser();
})

function logoutUser() {
  localStorage.removeItem('authToken');
  window.location.href = '/';
}
