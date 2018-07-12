'use strict'; 

var MOCK_WINES = [
  {
    wine_id: "0000001",
    publishedAt: "1527340947",
    username: "peter",
    wine: "La Rioja Alta Vina Alberdi Reserva",
    year: "2001",
    varietal: "Rioja",
    region: "Rioja",
    country: "Spain"
  },
  {
    wine_id: "000002",
    publishedAt: "1527341306",
    username: "peter",
    wine: "The Fableist 373 Cabernet Sauvignon",
    year: "2016",
    varietal: "Cabernet Sauvignon",
    region: "Paso Robles",
    country: "United States"
  },
  {
    wine_id: "000003",
    publishedAt: "1527341572",
    username: "peter",
    wine: "Whitehaven Sauvignon Blanc",
    year: "2017",
    varietal: "Sauvignon Blanc",
    region: "Marlborough",
    country: "New Zealand"
  }    
]

var MOCK_REVIEWS = [
    {
      review_id: "000005",
      wine_id: "000001",
      username: "peter",
      publishedAt: "1527340947",
      rating: "3",
      title: "not bad Rioja",
      text: "Lorem ipsum dolor sit amet, usu at commodo regione, tation apeirian pertinax cu nec. Et eos senserit mediocrem, erat quodsi melius id mel. Nam ea assum appareat. Nam sumo doming ex, ad nam odio illud oportere, forensibus assueverit inciderint cum in. Ius sale scribentur adversarium ne. Eos ut modus minimum, mutat omnesque vix at, eleifend assueverit nam eu. Cu sit alii ferri, sit assum tractatos ne, vel probo fabulas inimicus ne."         
    },
    {
      review_id: "000006",
      wine_id: "000002",
      username: "peter",
      rating: "4",
      publishedAt: "1527341306",
      title: "What a great Paso Robles Cab!",
      text: "Omnium pertinacia constituam ex usu, reque oblique ex usu, te fastidii volutpat voluptatum sea. Tollit partem nec et, omnes salutatus maiestatis mea te. Docendi intellegam ne vix, nisl equidem gloriatur an eum, exerci scaevola gubergren pri id. Diam graeci inciderint est ea. Ex vix stet animal, ei quem splendide vim, ullum altera his ex." 
    },
    {
      review_id: "000003",
      wine_id: "000003",
      username: "peter",
      publishedAt: "1527341572",
      rating: "4",
      title: "Pretty good for a white",
      text: "His no moderatius disputationi, ut ubique nonumes pro. Ex clita dicant accusam vim, eos ut facer elitr tollit. Hinc animal option eu eos, mutat regione delenit an sed. In accusam adipisci mel. Ut quo cibo sanctus meliore. Ea mollis elaboraret vis, bonorum recusabo duo in. Vis at laboramus expetendis."
    },
    {
      review_id: "000004",
      wine_id: "000003",
      username: "hubbell",
      publishedAt: "1527341598",
      rating: "1",
      title: "Cheap swill",
      text: "His no moderatius disputationi, ut ubique nonumes pro. Ex clita dicant accusam vim, eos ut facer elitr tollit. Hinc animal option eu eos, mutat regione delenit an sed. In accusam adipisci mel. Ut quo cibo sanctus meliore. Ea mollis elaboraret vis, bonorum recusabo duo in. Vis at laboramus expetendis."
    }
]

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
    <a href="#" onclick="browseWines(MOCK_WINES)">Browse Wines</a>
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
    $(".js-recent-reviews").append(`<p><a href="#" onclick="displayFullReview()">${data[i].title}</a></p>`);
  }
}

function getFullReview(callback, id) {
  let token = localStorage.getItem('authToken');
  $.ajax({
    url: 'data/review/' + id,
    type: "GET",
    headers: {
      "Authorization": 'Bearer ' + token
    },
    dataType: 'JSON'
  })
  .done(data => {
    callback(data);
  })
  .fail(function (err) {
    console.log(err);
  })
}

function displayFullReview(wineID) {
  $(".js-list-of-wines").empty();
  $(".js-recent-reviews").empty();
  let thisWine = MOCK_WINES.filter((element) => element.wine_id == wineID);
  let currentReviews = MOCK_REVIEWS.filter((element) => element.wine_id == wineID);
  console.log(currentReviews);
  $(".js-full-review").html(`<h2>${thisWine[0].wine}</h2><p>Year: ${thisWine[0].year}</p><p>${thisWine[0].country}: ${thisWine[0].region}</p>`);
  for (let i = 0; i < currentReviews.length; i++) {
    $(".js-full-review").append(`<h3>${currentReviews[i].title}</h3><p>${currentReviews[i].text}</p>`);
    }
}

function deleteReview(reviewID) {

}

function editReview(reviewID) {

}


function browseWines(data) {
  $(".js-home-screen").hide();
  for (let i = 0; i < data.length; i++) {
    $(".js-list-of-wines").append(`<p><a href="#" onclick="displayFullReview('${data[i].wine_id}')">${data[i].year} ${data[i].wine}</a></p>`);
  }
}


listenforLogin();
