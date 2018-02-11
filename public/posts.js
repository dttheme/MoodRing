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
    data.posts.forEach(function(post) {
      $('.post_group').append(
        `<div class='post' id=${post.id}>
            <div class='emoticon_wrapper'>
            <p>${post.publishedAt}</p>
            <p>Rating: ${post.rating}</p>
            <p>On this day:</p>
            <p>I felt: ${post.mood}</p>
            <p>I accomplished: ${post.activity}</p>
            <p> What else?: ${post.note}</p>
            <button type='button' class='delete_post_button'>Delete</button>
            <button type='button' class='edit_post_button'>Edit</button>
            </div>
          </div>
        `
      );
      console.log(post);
      deletePreviousEntries();
      decideEmoticon(post);
    })
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


// add emoticon face based on Rating



function decideEmoticon(post) {
  let rating = post.rating;
  if (rating === 1) {
    $('').css('background-color', 'rgba(127, 232, 188, 0.3)')
    // $('.emoticon_wrapper')
  } else if (rating === 2) {
    $('.post_group').css('background-color', 'rgba(101, 194, 201, 0.3)')
  } else if (rating === 3) {
    $('.post_group').css('background-color', 'rgba(85, 131, 176, 0.3)')
  } else if (rating === 4) {
    $('.post_group').css('background-color', 'rgba(82, 86, 176, 0.3)')
  } else if (rating === 5) {
    $('.post_group').css('background-color', 'rgba(93, 57, 143, 0.3)')
  }
}
