const MOCK_POSTS = {
  "posts": [
    {
      "id": "111",
      "mood": "happy",
      "activity": ["walk", "yoga", "brush teeth"],
      "note": "Today was great!",
      "publishedAt": 1517271600
    },
    {
      "id": "222",
      "mood": "sad",
      "activity": ["clean kitchen", "pet cat", "drink water"],
      "note": "Tomorrow I will take a walk and do yoga!",
      "publishedAt": 1517272183
    },
    {
      "id": "333",
      "mood": "productive",
      "activity": ["walk", "drink tea"],
      "note": "Got a lot done today!",
      "publishedAt": 1517322248
    }
  ]
}
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
            <p>On this day:</p>
            <p>I felt: ${data.posts[index].mood} </p>
            <p>I accomplished: ${data.posts[index].activity} </p>
            <p> What else?: ${data.posts[index].note}</p>
            <button type='button' class='delete_post_button'>Delete</button>
            <button type='button' class='edit_post_button'>Edit</button>
          </div>
        `
      );
      // console.log(data.posts[index]);
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
