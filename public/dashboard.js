
//function to turn activity into an array
//OR
//function to add new input box for each new activity_input


//function for identifying the mood associated with an emoji
//OR
//let the user pick whichever emoji they want, send with the rest of the dataType

//function for correctly submitting form "Success! Great work!"


$('#new_post_form').submit(function(event) {
  event.preventDefault();
  addNewPost();
});

function addNewPostRequest(mood, activity, note) {
  $.ajax({
    url: '/posts',
    type: 'POST',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(
      {
        mood: mood,
        activity: activity,
        note: note
      }
    ),
    // success: function(data) {},
    // error: function(jqXHR, exception) {}
  });
}

function addNewPost() {
  let mood = $('#mood_input').val().trim();
  let activity = $('#activity_input').val().trim();
  let note = $('#note_input').val().trim();
  addNewPostRequest(mood, activity, note);
}
