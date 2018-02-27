'use strict';

//Global variables
let fieldCount = 1;



//Call functions
addMoodInput();
addActivityInput();
removeInput('#mood_input_wrap');
removeInput('#activity_input_wrap');


//function for correctly submitting form "Success! Great work!"
//add rating scale with emojis
//function for turning submitted inputs into an arrays

$(function() {
  const token = localStorage.getItem('authToken');
  if (!token) {
    window.location.href = '/login.html';
  }
  $.ajax({
    url: '/auth/basicinfo',
    type: 'GET',
    dataType: 'json',
    headers: {
      Authorization: `Bearer ${token}`
    },
    success: function() {
      $('.loader').remove();
    },
    error: function() {
      localStorage.removeItem('authToken');
      window.location.href = '/login.html';
      $('.alert').html('<p>Email or password is incorrect.</p>');
    }
  })
})


//Post the form with sumbitted inputs
$('#new_post_form').submit(function(event) {
  event.preventDefault();
  addNewPost();
});

function addNewPostRequest(rating, moodArray, activityArray, note) {
  $.ajax({
    url: '/posts',
    type: 'POST',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(
      {
        rating: rating,
        mood: moodArray,
        activity: activityArray,
        note: note
      }
    ),
    success: function(data) {
      console.log(`Successfully created post ${data.id}`)
      console.log(rating);
      console.log(activityArray);
    }
    // error: function(jqXHR, exception) {}
  });
}

function addNewPost() {
  let rating = $('input[type="radio"][name="emoticons"]:checked').val();
  let moodArray = $('input[class="mood_input input"]').map(function() {return $(this).val();}).get();
  let activityArray = $('input[class="activity_input input"]').map(function() {return $(this).val();}).get();
  let note = $('#note_input').val().trim();
  addNewPostRequest(rating, moodArray, activityArray, note);
}

//Add additional inputs, remove on click
function addMoodInput() {
  const max_fields = 5;
  $('#add_mood_button').click(function(event) {
    event.preventDefault();
    if(fieldCount < max_fields) {
      fieldCount++;
      $('#mood_input_wrap').append(
        `
        <div><input type="text" class="mood_input input"><a href="#" class="remove_field" role="button" title="Remove"><i class="fa fa-times-circle"></i></a><div>
        `
      );
    }
  })
}

function addActivityInput() {
  const max_fields = 10;
  $('#add_activity_button').click(function(event) {
    event.preventDefault();
    if(fieldCount < max_fields) {
      fieldCount++;
      $('#activity_input_wrap').append(
        `
        <div><input type="text" class="activity_input input"><a href="#" class="remove_field" role="button" title="Remove"><i class="fa fa-times-circle"></i></a><div>
        `
      );
    }
  })
}

function removeInput(wrapper) {
  $(wrapper).on('click','.remove_field', function(event){
       event.preventDefault();
       $(this).parent('div').remove(); fieldCount--;
   })
}
