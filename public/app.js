'use strict'; 

function listenforLogin() {
  $(".login-form").submit (event => {
    event.preventDefault();
    const existingUser = {
      username: $("input[name='username']").val(),
      password: $("input[name='password']").val()
    }

    logInUser(existingUser);

  })
}

function logInUser(user) {
  let password = user.password; 
  let username = user.username;
  $.ajax({
    url: "api/auth/login",
    type: "POST",
    data: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json"
    }
  })
  .done(token => {
    localStorage.setItem("authToken", token.authToken);
    localStorage.setItem("username", username);
    loadHomeScreen();
  })
  .fail(function (err) {
    console.log(err);
    if (err.status === 401) {
      $('.errors-area').html('Username and/or password incorrect');
    }
  });  
}

$("#new-account").click(event => {
  event.preventDefault();
  $(".login-form").hide();
  $(".create-account-form").show()
})

$(".create-account-form").submit(event => {
  event.preventDefault();
  var newUser = {
    username: $("input[name='requestedUsername']").val(),
    firstName: $("input[name='firstName']").val(),
    lastName: $("input[name='lastName']").val(),
    password: $("input[name='requestedPassword']").val()
  }
  postNewUser(newUser) 
})

function postNewUser(user) {
  let username = user.username;
  let password = user.password;
  $.ajax({
    url: "/api/users",
    type: "post",
    data: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json"
    }
  })
  .done(function (data) {
    $(".login-form").show();  
    $(".create-account-form").hide();    
  })
  .fail(function (err) {
    if (password.length < 10) {
      $(".errors-area").html("<h2>Password must be at least 10 characters.</h2>")
    }
    if (err.responseJSON.location === "username") {
      $(".errors-area").html(`<h2>${err.responseJSON.message}. Please try a different username.</h2>`)
    }
  })
}

function loadHomeScreen() {
  $(".login-page").hide(); 
  $(".home-screen").show();
  $(".js-submit-status").hide();
  $(".js-full-review").hide();
  $(".js-recent-reviews").hide();
  $(".add-new-wine").hide();
  $(".js-list-of-wines").hide();
  $(".js-full-wine-page").hide()
}

function loadAddScreen() {
  $(".home-screen").hide();
  $(".add-new-wine").show()
}

$(".add-new-wine-form").submit(event => {
  event.preventDefault();
  var newWineEntry = {
    name: $("input[name='wine-name']").val(),
    year: $("input[name='wine-year']").val(),
    varietal: $("input[name='wine-varietal']").val(),
    region: $("input[name='wine-region']").val(),
    country: $("input[name='wine-country']").val(),
  };
  var newWineReview = {
    rating: $("input[name='wine-rating']").val(), 
    title: $("input[name='headline']").val(),
    text: $("input[name='wine-review']" ).val()
  };

  postNewWine(newWineEntry, newWineReview);

  $(".add-new-wine").hide();
  $(".js-submit-status").show();
  $(".js-submit-status").html(
    `
    <p>Your review of ${newWineEntry.wine} has been submitted.</p>
    <p>Rating: ${newWineReview.rating}</p>
    <p>Headline: ${newWineReview.title}</p>
    <p>Review: ${newWineReview.text}</p>
    <button onclick="loadHomeScreen()">Back to Home Screen</button>
    `
  )
})

$(document).on("submit", "#edit-review", event => {
  event.preventDefault();


    let rating = $("#edit-rating").val();
    let title = $("#edit-title").val();
    let text = $("#edit-text").val();
    let id = $("#edit-review").attr("data")
  var updatedWineReview = {
    rating,
    title,
    text,
    id
  };

  putNewReview(updatedWineReview);

  $(".add-new-wine").hide();
  $(".edit-review").hide();
  $(".js-submit-status").show();
  $(".js-submit-status").html(
    `
    <p>Your review has been updated.</p>
    <p>Rating: ${updatedWineReview.rating}</p>
    <p>Headline: ${updatedWineReview.title}</p>
    <p>Review: ${updatedWineReview.text}</p>
    <button onclick="loadHomeScreen()">Back to Home Screen</button>
    `
  )
})


function postNewWine(wine, review) {
  let token = localStorage.getItem("authToken");
  let username = localStorage.getItem("username");
  wine.username = username;
  review.username = username;
  $.ajax({
    url: '/data/wines',
    type: 'POST',
    data: JSON.stringify(wine),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    }
  })
  .done(data => {
    console.log(data)
    review.wine_id = data._id;
    postNewReview(review);
  })
  .fail(err => {
    console.log(err)
  })
}

function postNewReview(review) {
  let token = localStorage.getItem("authToken");
  $.ajax({
    url: '/data/reviews',
    type: 'POST',
    data: JSON.stringify(review),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    }
  })
  .done(data => {
    console.log(data)
  })
  .fail(err => {
    console.log(err)
  })
}

function putNewReview(review) {
  let token = localStorage.getItem("authToken");
  $.ajax({
    url: `/data/reviews/${review.id}`,
    type: 'PUT',
    data: JSON.stringify(review),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    }
  })
  .done(data => {
    console.log(data)
  })
  .fail(err => {
    console.log(err)
  })
}


function getRecentReviews(callback) {
  let token = localStorage.getItem('authToken');
  $.ajax({
    url: '/data/reviews',
    type: 'GET',
    headers: {
      "Authorization": 'Bearer ' + token
    },
    dataType: 'JSON' 
  })
  .done(data => {
    callback(data); 
  })
  .fail(function (err) {
    console.error(err);
  })
}

function displayRecentReviews(data) {
  $(".back").show();
  $(".home-screen").hide();
  $(".js-full-review").hide();
  $(".js-recent-reviews").show();
  $(".js-recent-reviews").empty();
  for (let i = 0; i < data.length; i++) {
    $(".js-recent-reviews").append(`<p><a class="wine-item" href="#" data="${data[i]._id}">${data[i].title}</a></p>`);
  }
}

function browseWines(callback) {
  let token = localStorage.getItem('authToken');
  $.ajax({
    url: '/data/wines',
    type: 'GET',
    headers: {
      "Authorization": 'Bearer ' + token
    },
    dataType: 'JSON' 
  })
  .done(data => {
    callback(data); 
  })
  .fail(function (err) {
    console.error(err);
  })
}

function displayAllWines(data) {
  $(".home-screen").hide();
  $(".js-list-of-wines").show();
  $(".js-list-of-wines").empty();
  for (let i = 0; i < data.length; i++) {
  $(".js-list-of-wines").append(`<p><a href="#" onclick="displayFullWinePageStub()">${data[i].year} ${data[i].name}</a></p>`);
  }
}

function displayFullWinePageStub() {
  $(".js-list-of-wines").hide();
  $(".js-full-wine-page").show();
  $(".js-full-wine-page").html(
    `<h2>Full Wine Page Will Go Here</h2>`
    )
}

function displayFullWinePage(thisWine) {
  console.log(thisWine._id);
  let currentUser = localStorage.getItem("username");
  $(".js-list-of-wines").hide();
  $(".js-full-wine-page").empty();
  $(".js-full-wine-page").show();
  $(".js-full-wine-page").html(`<h1>${thisWine.name}</h1>`)
  if (currentUser === thisWine.username) {
    $(".js-full-wine-page").append(`<button data="${thisWine._id}" class="delete">Delete</button>
    <button data="${thisWine._id}" class="edit">Edit</button>`);
  }
  $(".js-full-wine-page").append(`<br><button onclick="browseWines(displayAllWines)">Back to List of Reviews</button>`)
}




function getFullReview(callback, id) {
  let token = localStorage.getItem('authToken');
  $.ajax({
    url: 'data/reviews/' + id,
    type: "GET",
    headers: {
      "Authorization": 'Bearer ' + token
    },
    dataType: 'JSON'
  })
  .done(reviewData => {
    let wine_id = reviewData.wine_id;
    $.ajax({
      url: 'data/wines/' + wine_id,
      type: "GET",
      headers: {
        "Authorization": 'Bearer ' + token
      },
      dataType: 'JSON'
    })
    .done(wineData => {
      callback(wineData, reviewData);
    })
  })
  .fail(function (err) {
    console.log(err);
  })
}

function getReviewByID(callback, id) {
   let token = localStorage.getItem('authToken');
  $.ajax({
    url: 'data/reviews/' + id,
    type: "GET",
    headers: {
      "Authorization": 'Bearer ' + token
    },
    dataType: 'JSON'
  })
  .done(reviewData => {
    callback(reviewData)
  })
  .fail(function (err) {
    console.log(err);
  })
}

function getWineByID(callback, id) {
   let token = localStorage.getItem('authToken');
  $.ajax({
    url: 'data/wines/' + id,
    type: "GET",
    headers: {
      "Authorization": 'Bearer ' + token
    },
    dataType: 'JSON'
  })
  .done(wineData => {
    callback(wineData)
  })
  .fail(function (err) {
    console.log(err);
  })
}


function deleteFullReview(id) {
  let token = localStorage.getItem('authToken');
  $.ajax({
    url: 'data/reviews/' + id,
    type: "DELETE",
    headers: {
      "Authorization": 'Bearer ' + token
    },
    dataType: 'JSON'
  })
  .done(() => {
    $(".js-full-review").hide();
    $(".js-submit-status").show();
    $(".js-submit-status").html(
    `
    <p>Your review has been deleted.</p>
    <button onclick="loadHomeScreen()">Back to Home Screen</button>
    `
  )

  })
  .fail(function (err) {
    console.log(err);
  })
}

$(".js-recent-reviews").on("click", ".wine-item", function(){
  let id = $(this).attr("data"); 
  getFullReview(displayFullReview, id)
})

$(".js-full-review").on("click", ".delete", function(){
  let id = $(this).attr("data"); 
  deleteFullReview(id);
})

$(".js-full-review").on("click", ".edit", function(){
  let id = $(this).attr("data");
  getReviewByID(editFullReview, id)
})

function editFullReview(review) {
  $(".js-full-review").hide();
  $(".edit-review").show();
  $("#edit-rating").val(review.rating);
  $("#edit-title").val(review.title);
  $("#edit-text").val(review.text);
  $("#edit-review").attr("data",review._id)
}

function displayFullReview(thisWine, thisReview) {
  console.log(thisReview._id);
  let currentUser = localStorage.getItem("username");
  $(".js-list-of-wines").empty();
  $(".js-recent-reviews").empty();
  $(".js-full-review").show();
  $(".js-full-review").html(`<h1>${thisWine.name}</h1><h2>${thisReview.title}</h2>
    <p>${thisReview.text}</p><p>Rating: ${thisReview.rating}</p>`)
  if (currentUser === thisReview.username) {
    $(".js-full-review").append(`<button data="${thisReview._id}" class="delete">Delete</button>
    <button data="${thisReview._id}" class="edit">Edit</button>`);
  }
  $(".js-full-review").append(`<br><button onclick="getRecentReviews(displayRecentReviews)">Back to List of Reviews</button>`)
}


listenforLogin();
