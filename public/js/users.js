'use strict';


// SIGN UP

$('.sign_up_submit').click(function(event) {
  event.preventDefault();
  newUser();
  console.log("Heard!");
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
  .catch((err) => {
    done();
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
  let xhr = new XMLHttpRequest();
  let data = {
    username: username,
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
