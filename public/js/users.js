$('sign_up_submit').click(function(event) {
  submitNewUser();
})

function submitNewUser(callback) {
  $.ajax({
    url: '/users',
    type: 'POST',
    dataType: 'json',

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

$('login_submit').click(function(event) {

})
