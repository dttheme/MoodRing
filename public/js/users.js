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
        $('.sign_up_failure').remove();
        $('#sign_up_form').prepend(
          `
          <div class='sign_up_success'><span style='vertical-align: middle;'>Hurray! You have successfully signed up! Now you can <a href='/login.html'>login</a>!<span></div>
          `);
        }
      },
      error: (jqXHR, exception) => {
        $('#sign_up_form').prepend(
          `
          <div class='sign_up_failure'><span>Whoops! Please fill out all of the fields before submitting the form!</span></div>
          `
        )
      }
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
      error: (jqXHR, exception) => {
        loginFailure();
      }
    })
  }

  function successToken(token) {
    if(token) {
      localStorage.setItem('authToken', token.authToken);
      window.location.href = '/dashboard.html';
    }
  }

  function loginFailure() {
    $('.alert').attr('aria-hidden','false').removeClass('hidden');
  }

  // LOGOUT

  $('.logout_button').click(function(event) {
    event.preventDefault();
    logoutUser();
  })

  function logoutUser() {
    localStorage.removeItem('authToken');
    window.location.href = '/';
  }

  // Show links for authenticated users
  $(() => {
    showLinks();
    let token = localStorage.getItem('authToken');
    if(token != null) {
      let userObject = parseJwt(token);
      $('.greeting').show().append((userObject.user.firstName) + '!');
    }
  })

  function showLinks() {
    let clientToken = localStorage.getItem('authToken');
    if (!clientToken) {
      $('.dashboard_link').hide();
      $('.logout_button').hide();
      $('.archive_link').hide();
      $('.login_link').show();
    } else {
      $('.dashboard_link').show();
      $('.logout_button').show();
      $('.archive_link').show();
      $('.login_link').hide();
    }
  }

  function parseJwt (token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  };
