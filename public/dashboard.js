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




//Post the form with sumbitted inputs
$('#new_post_form').submit(function(event) {
  event.preventDefault();
  addNewPost();
});

function addNewPostRequest(moodArray, activityArray, note) {
  $.ajax({
    url: '/posts',
    type: 'POST',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(
      {
        mood: moodArray,
        activity: activityArray,
        note: note
      }
    ),
    success: function(data) {
      console.log(moodArray);
      console.log(activityArray);
    }
    // error: function(jqXHR, exception) {}
  });
}

function addNewPost() {
  let moodArray = $('input[class="mood_input"]').map(function() {return $(this).val();}).get();
  let activityArray = $('input[class="activity_input"]').map(function() {return $(this).val();}).get();
  let note = $('#note_input').val().trim();
  addNewPostRequest(moodArray, activityArray, note);
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
        <div><input type="text" class="mood_input"><a href="#" class="remove_field">Remove</a><div><br>
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
        <div><input type="text" class="activity_input"><a href="#" class="remove_field">Remove</a><div><br>
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
