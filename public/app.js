'use strict'; 


$(".back").click(() => {
  $(".js-home-screen").show();
  $(".js-options").hide();
  $(".back").hide()
})

function listenforLogin() {
  $(".js-login-form").submit (event => {
    event.preventDefault();
    //loadHomeScreen();
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
  $(".js-login-form").hide();
  $(".js-create-account-form").show()
})

$(".js-create-account-form").submit(event => {
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
    $(".js-login-form").show();  
    $(".js-create-account-form").hide();    
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
  $("body").css("background-image","none"); 
  $(".back").hide();
  $(".js-home-screen").show();
  $(".js-submit-status").hide();
  $(".js-home-screen").html(
    `
    <a href="#" onclick="loadAddScreen()">Add a New Wine</a><br>
    <a href="#" onclick="getRecentReviews(displayRecentReviews)">See Recent Reviews</a><br>
    <a href="#" onclick="browseWines(displayAllWines)">Browse Wines</a>
    `
  )
}

function loadAddScreen() {
  $(".js-home-screen").hide();
  $(".js-add-new-wine").show()
}

  $(".js-add-new-wine-form").submit(event => {
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

    $(".js-add-new-wine").hide();
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
  $(".js-home-screen").hide();
  for (let i = 0; i < data.length; i++) {
    $(".js-recent-reviews").append(`<p><a class="wine-item" href="#" data="${data[i]._id}">${data[i].title}</a></p>`);
  }
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
    loadHomeScreen();
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
  let headline =  $(this).prev().prev().prev().text();
  let text = $(this).prev().prev().text();
  let rating = $(this).prev().text();
  editFullReview(id, headline, text, rating);
})

function editFullReview(id, headline, text, rating) {
  $(".js-edit-review").html(
    `<form class="edit-review">

    </form>`
  )
}

function displayFullReview(thisWine, thisReview) {
  console.log(thisReview._id);
  let currentUser = localStorage.getItem("username");
  $(".js-list-of-wines").empty();
  $(".js-recent-reviews").empty();
  $(".js-full-review").html(`<h1>${thisWine.name}</h1><h2>${thisReview.title}</h2>
    <p>${thisReview.text}</p><p>Rating: ${thisReview.rating}</p>`)
  if (currentUser === thisReview.username) {
    $(".js-full-review").append(`<button data="${thisReview._id}" class="delete">Delete</button>
    <button data="${thisReview._id}" class="edit">Edit</button>`);
  }
  $(".js-full-review").append(`<br><button onclick="loadHomeScreen()">Back to Home Screen</button>`)
}

function editReview(reviewID) {
//need to present form that allows user to edit fields
//need to handle put call
//need to present next step -- confirmation, reload edited page?
}


function browseWines(data) {
  $(".js-home-screen").hide();
  for (let i = 0; i < data.length; i++) {
    $(".js-list-of-wines").append(`<p><a href="#" onclick="displayFullReview('${data[i].wine_id}')">${data[i].year} ${data[i].wine}</a></p>`);
  }
}


listenforLogin();
