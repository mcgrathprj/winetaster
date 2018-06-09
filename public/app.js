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

function listenforLogin() {
  $(".js-login-form").submit (event => {
    event.preventDefault();
    loadHomeScreen();
  })
}

function loadHomeScreen() {
  $(".js-login-form").css("display","none");  
  $(".js-home-screen").css("display","block");
  $(".js-submit-status").css("display", "none");
  $(".js-home-screen").html(
    `
    <a href="#" onclick="loadAddScreen()">Add a New Wine</a><br>
    <a href="#" onclick="displayRecentReviews(MOCK_REVIEWS)">See Recent Reviews</a><br>
    <a href="#" onclick="browseWines(MOCK_WINES)">Browse Wines</a>
    `
  )
}

function loadAddScreen() {
  $(".js-home-screen").css("display","none");
  $(".js-add-new-wine").css("display","block")
}

  $(".js-add-new-wine-form").submit(event => {
    event.preventDefault();
    var newWineEntry = {
      wine: $("input[name='wine-name']").val(),
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

    MOCK_REVIEWS.push(newWineReview);
    MOCK_WINES.push(newWineEntry);
    $(".js-add-new-wine").css("display","none");
    $(".js-submit-status").css("display","block");
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


function displayRecentReviews(data) {
  $(".js-home-screen").css("display","none");
  for (let i = 0; i < data.length; i++) {
    $(".js-recent-reviews").append(`<p><a href="#" onclick="displayFullReview(${data[i].wine_id})">${data[i].title}</a></p>`);
  }
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

function browseWines(data) {
  $(".js-home-screen").css("display","none");
  for (let i = 0; i < data.length; i++) {
    $(".js-list-of-wines").append(`<p><a href="#" onclick="displayFullReview('${data[i].wine_id}')">${data[i].year} ${data[i].wine}</a></p>`);
  }
}


listenforLogin();