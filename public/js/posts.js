"use strict";

$(() => {
  authorizeUser();
  editClick();
  resetClick();
  submitEdit();
});

function authorizeUser() {
  const token = localStorage.getItem("authToken");
  if (!token) {
    window.location.href = "/login.html";
  }
  $.ajax({
    url: "/auth/info",
    type: "GET",
    dataType: "json",
    headers: {
      Authorization: `Bearer ${token}`
    },
    success: function() {
      $(".loader").remove();
      getAndDisplayPreviousEntries();
    },
    error: function() {
      localStorage.removeItem("authToken");
      window.location.href = "/login.html";
    }
  });
}

function getPreviousEntries(callback) {
  const token = localStorage.getItem("authToken");
  $.ajax({
    url: "/posts",
    type: "GET",
    dataType: "json",
    headers: {
      Authorization: `Bearer ${token}`
    },
    success: function(data) {
      if (data) {
        callback(data);
      }
    },
    error: function(jqXHR, exception) {}
  });
}

function displayPreviousEntries(data) {
  if (data.length === 0) {
    $(".post_group").append(
      `<p class='no_results'> You don't have any posts yet! Click 'Dashboard' to get started.</p>`
    );
  } else {
    data.forEach(function(post) {
      let postDate = convertDate(post);
      let moodAsAString = post.mood.join(",  ");
      let activityAsAString = post.activity.join(",  ");
      $(".post_group").append(
        `<div class='post'>
        <div class='post_wrapper rating${post.rating}' id=${post._id}>
        <div class="post_header">
        <p><span class='mood_string'>${moodAsAString}</span></p><br>
        <p class="post_date">${postDate}</p>
        </div>
        <span class='emoticon'></span><br><br>
        <p><b>I accomplished:</b><span class='activity_string'> ${activityAsAString}</span></p><br>
        <p><b>I noted:</b><span class='note_string'> ${
          post.note
        }</span></p><br><br>
        <button type='button' class='delete_post_button'>Delete</button>
        <button type='button' class='edit_post_button'>Edit</button>
        <div class='edit_controls'>
        <button type='button' class='reset_post_button'>Reset</button>
        <button type='button' class='submit_edit_button'>Submit</button>
        </div>
        </div>
        </div>
        `
      );
      deletePreviousEntries(data);
    });
  }
}

function deletePreviousEntries(data) {
  const token = localStorage.getItem("authToken");
  $(".delete_post_button").click(function(event) {
    const postId = $(this)
      .closest("div")
      .attr("id");
    $.ajax({
      url: `/posts/${postId}`,
      type: "DELETE",
      dataType: "json",
      headers: {
        Authorization: `Bearer ${token}`
      },
      success: function(data) {
        console.log(`Successfully deleted post ${postId}`);
        $(`#${postId}`).replaceWith(`<p>Deleting post...</p>`);
      },
      error: function(jqXHR, exception) {}
    });
    setTimeout(function() {
      location.reload(true);
    }, 1500);
  });
}

function getAndDisplayPreviousEntries() {
  getPreviousEntries(displayPreviousEntries);
}

//covert the ISO date to human readable Date
function convertDate(post) {
  let date = new Date(post.createdAt).toString();
  let parsedDate = date.slice(0, 21);
  return parsedDate;
}

function editClick() {
  $(".post_group").on("click", ".edit_post_button", function(event) {
    event.preventDefault();
    $(this).hide();
    $(this)
      .parent()
      .find(".edit_controls")
      .show();

    //Mood
    const $mood = $(this)
      .parent()
      .find(".mood_string");
    $mood.replaceWith(
      `<input type='text' value='${$mood.text()}' data-original='${$mood.text()}' name='mood' class='mood_edit_input'>`
    );
    //Activity
    const $activity = $(this)
      .parent()
      .find(".activity_string");
    $activity.replaceWith(
      `<input type='text' value='${$activity.text()}' data-original='${$activity.text()}' name='activity' class='activity_edit_input'>`
    );
    //Note
    const $note = $(this)
      .parent()
      .find(".note_string");
    $note.replaceWith(
      `<textarea name='note' class='note_edit_input' data-original='${$note.text()}'>${$note.text()}</textarea>`
    );
  });
}

function resetClick() {
  $(".post_group").on("click", ".reset_post_button", function(event) {
    event.preventDefault();
    $(this)
      .parent()
      .parent()
      .find(".edit_post_button")
      .show();
    $(this)
      .parent()
      .parent()
      .find(".edit_controls")
      .hide();

    //Mood
    const $mood = $(this)
      .parent()
      .parent()
      .find(".mood_edit_input");
    $mood.replaceWith(
      `<span class='mood_string'>${$mood.data("original")}</span>`
    );
    //Activity
    const $activity = $(this)
      .parent()
      .parent()
      .find(".activity_edit_input");
    $activity.replaceWith(
      `<span class='activity_string'>${$activity.data("original")}</span>`
    );
    //Note
    const $note = $(this)
      .parent()
      .parent()
      .find(".note_edit_input");
    $note.replaceWith(
      `<span class='note_string'> ${$note.data("original")}</span>`
    );
  });
}

function submitEdit() {
  $(".post_group").on("click", ".submit_edit_button", function(event) {
    event.preventDefault();
    const postId = $(this)
      .parent()
      .parent()
      .attr("id");
    const mood = $(this)
      .parent()
      .parent()
      .find(".mood_edit_input")
      .val();
    const activity = $(this)
      .parent()
      .parent()
      .find(".activity_edit_input")
      .val();
    const note = $(this)
      .parent()
      .parent()
      .find(".note_edit_input")
      .val();
    const token = localStorage.getItem("authToken");
    $.ajax({
      url: `/posts/${postId}`,
      headers: {
        Authorization: `Bearer ${token}`
      },
      method: "PUT",
      data: {
        mood: mood,
        activity: activity,
        note: note
      },
      success: () => {
        console.log(`Successfully edited post ${postId}`);
      },
      error: () => {
        console.log("Edit not successful!");
      }
    });
    setTimeout(function() {
      location.reload(true);
    }, 700);
  });
}
