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

// function getPreviousEntries(callbackFn) {
//   setTimeout(function() {
//     callbackFn(MOCK_POSTS)
//   }, 3000);
// }

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
    }
  });
}


//object literal looks better!
function displayPreviousEntries(data) {
  for (index in data.posts) {
    $('.post-group').append(
      `<div class='post'>
      <p>${data.posts[index].publishedAt}</p>
        <p>On this day:</p>
          <p>I felt: ${data.posts[index].mood} </p>
          <p>I accomplished: ${data.posts[index].activity} </p>
          <p> What else?: ${data.posts[index].note}</p>
        </div>
      `
    );
    console.log(data.posts[index]);
  }
}

function getAndDisplayPreviousEntries() {
  getPreviousEntries(displayPreviousEntries);
}

$(function() {
  getAndDisplayPreviousEntries();
})
