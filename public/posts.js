'use strict';

//create callback function that parses data, returns HTML etc etc
function getPreviousEntries(callbackFn) {
  $.ajax({
    url: '/posts',
    type: 'GET',
    dataType: 'json',

    success: function(data) {
      if(data) {
        var results = data;
        callbackFn(results);
        console.log(data);
      }
    },
    error: function(jqXHR, exception) {
      console.log(jqXHR);
      console.log(exception);
    }
  });
}

//object literal looks better!
function displayPreviousEntries(data) {
  if (data.length === 0) {
    $('post_group').html(`<h2 class='no results'> You don't have any posts yet! Click 'Add New Post' to get started.`)
  } else {
    for (index in data.posts) {
      $('.post_group').append(
        `<div class='post' id=${data.posts[index].id}>
            <p>${data.posts[index].publishedAt}</p>
            <p>Rating: ${data.posts[index].rating}
            <p>On this day:</p>
            <p>I felt: ${data.posts[index].mood} </p>
            <p>I accomplished: ${data.posts[index].activity} </p>
            <p> What else?: ${data.posts[index].note}</p>
            <button type='button' class='delete_post_button'>Delete</button>
            <button type='button' class='edit_post_button'>Edit</button>
          </div>
        `
      );
      console.log(data.posts[index]);
      deletePreviousEntries();
    }
  }
}

function deletePreviousEntries() {
  $('.delete_post_button').on('click', function(event) {
    const postId = $(this).closest('div').attr('id');
    $.ajax({
      url:`/posts/${postId}`,
      type: 'DELETE',
      dataType: 'json',

      success: function(data){console.log(`Successfully deleted post ${postId}`)},
      error: function(jqXHR, exception) {
        console.log(jqXHR);
        console.log(exception);}
    });

    setTimeout(function() {
      location.reload(true);
    }, 700);
  });
}

function getAndDisplayPreviousEntries() {
  getPreviousEntries(displayPreviousEntries);
}

$(function() {
  getAndDisplayPreviousEntries();
})

//change post background color based on rating


//add emoticon face based on Rating
// function decideEmoticon(data) {
//   let rating = data.posts[index].rating;
//
//   if (rating === 1) {
//     $('div').css('background-color', '')
//   }
// }
