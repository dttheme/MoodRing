'use strict';

$(() => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    window.location.href = '/login.html';
  }
  $.ajax({
    url: '/auth/info',
    type: 'GET',
    dataType: 'json',
    headers: {
      Authorization: `Bearer ${token}`
    },
    success: function() {
      $('.loader').remove();
      getAndDisplayPreviousEntries();
    },
    error: function() {
      localStorage.removeItem('authToken');
      window.location.href = '/login.html';
    }
  })
})

function getPreviousEntries(callback) {
  const token = localStorage.getItem('authToken');
  $.ajax({
    url: '/posts',
    type: 'GET',
    dataType: 'json',
    headers: {
      Authorization: `Bearer ${token}`
    },
    success: function(data) {
      if(data) {
        callback(data);
      }
    },
    error: function(jqXHR, exception) {}
  });
}

function displayPreviousEntries(data) {
  if (data.length === 0) {
    $('.post_group').append(`<h2 class='no results'> You don't have any posts yet! Click 'Dashboard' to get started.`)
  } else {
    data.forEach(function(post) {
      let postDate = convertDate(post);
      let moodAsAString = (post.mood).join(', ');
      let activityAsAString = (post.activity).join(', ')
      $('.post_group').append(
        `<div class='post'>
            <div class='post_wrapper rating${post.rating}' id=${post._id}>
            <p class="post_date">${postDate}</p>
            <span class='emoticon'></span><br><br>
            <p><b>I felt:</b> ${moodAsAString}</p><br>
            <p><b>I accomplished:</b> ${activityAsAString}</p><br>
            <p><b>I noted:</b> ${post.note}</p><br><br>
            <button type='button' class='delete_post_button'>Delete</button>
            <button type='button' class='edit_post_button'>Edit</button>
            </div>
          </div>
        `
      );
      deletePreviousEntries(data);
    })
  }
}

function deletePreviousEntries(data) {
  const token = localStorage.getItem('authToken');
  $('.delete_post_button').click(function(event) {
    const postId = $(this).closest('div').attr('id');
    $.ajax({
      url:`/posts/${postId}`,
      type: 'DELETE',
      dataType: 'json',
      headers: {
        Authorization: `Bearer ${token}`
      },
      success: function(data){console.log(`Su// add emoticon face based on Ratingccessfully deleted post ${postId}`)},
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

//covert the ISO date to human readable Date
function convertDate(post) {
  let date = new Date(post.createdAt).toString();
  let parsedDate = date.slice(0,21);
  return parsedDate;
}
