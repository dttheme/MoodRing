'use strict';

//create callback function that parses data, returns HTML etc etc
function getPreviousEntries(callback) {
  $.ajax({
    url: '/posts',
    type: 'GET',
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
  });
}

//object literal looks better!
function displayPreviousEntries(data) {
  if (data.length === 0) {
    $('post_group').append(`<h2 class='no results'> You don't have any posts yet! Click 'Add New Post' to get started.`)
  } else {
    data.posts.forEach(function(post) {
      let postDate = convertDate(post);
      $('.post_group').append(
        `<div class='post'>
            <div class='post_wrapper' id=${post.id}>
            <p class="post_date">${postDate}</p>
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
      decideEmoticon(post);
      deletePreviousEntries();
    })
  }
}

function deletePreviousEntries() {
  $('.delete_post_button').click(function(event) {
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

//covert the ISO date to human readable Date
function convertDate(post) {
  let date = new Date(post.publishedAt).toString();
  let parsedDate = date.slice(0,21);
  return parsedDate;
}



// add emoticon face based on Rating

//change post background color based on rating
function decideEmoticon(post) {
  let rating = post.rating;
  if (rating === 1) {
    $('.emoticon_wrapper').css('background-color', 'rgba(127, 232, 188, 0.3)')
    // $('.emoticon_wrapper')
  } else if (rating === 2) {
    $('.emoticon_wrapper').css('background-color', 'rgba(101, 194, 201, 0.3)')
  } else if (rating === 3) {
    $('.emoticon_wrapper').css('background-color', 'rgba(85, 131, 176, 0.3)')
  } else if (rating === 4) {
    $('.emoticon_wrapper').css('background-color', 'rgba(82, 86, 176, 0.3)')
  } else if (rating === 5) {
    $('.emoticon_wrapper').css('background-color', 'rgba(93, 57, 143, 0.3)')
  }
}
