'use strict'; 
var MOCK_REVIEWS = [
    {
      wine_id: "0000001",
      wine: "La Rioja Alta Vina Alberdi Reserva",
      year: "2001",
      type: "Rioja",
      region: "Rioja",
      country: "Spain",
      rating: "3",
      publishedAt: "1527340947",
      title: "not bad Rioja",
      text: "Lorem ipsum dolor sit amet, usu at commodo regione, tation apeirian pertinax cu nec. Et eos senserit mediocrem, erat quodsi melius id mel. Nam ea assum appareat. Nam sumo doming ex, ad nam odio illud oportere, forensibus assueverit inciderint cum in. Ius sale scribentur adversarium ne. Eos ut modus minimum, mutat omnesque vix at, eleifend assueverit nam eu. Cu sit alii ferri, sit assum tractatos ne, vel probo fabulas inimicus ne."
    },
    {
      wine_id: "000002",
      username: "peter",
      wine: "The Fableist 373 Cabernet Sauvignon",
      year: "2016",
      type: "Cabernet Sauvignon",
      region: "Paso Robles",
      country: "United States",
      rating: "4",
      publishedAt: "1527341306",
      title: "What a great Paso Robles Cab!",
      text: "Omnium pertinacia constituam ex usu, reque oblique ex usu, te fastidii volutpat voluptatum sea. Tollit partem nec et, omnes salutatus maiestatis mea te. Docendi intellegam ne vix, nisl equidem gloriatur an eum, exerci scaevola gubergren pri id. Diam graeci inciderint est ea. Ex vix stet animal, ei quem splendide vim, ullum altera his ex."
    },
    {
      wine_id: "000003",
      wine: "Whitehaven Sauvignon Blanc",
      year: "2017",
      type: "Sauvignon Blanc",
      region: "Marlborough",
      country: "New Zealand",
      reviews: [
        {
          review_id: "000003",
          username: "peter",
          publishedAt: "1527341572",
          rating: "4",
          title: "Pretty good for a white",
          text: "His no moderatius disputationi, ut ubique nonumes pro. Ex clita dicant accusam vim, eos ut facer elitr tollit. Hinc animal option eu eos, mutat regione delenit an sed. In accusam adipisci mel. Ut quo cibo sanctus meliore. Ea mollis elaboraret vis, bonorum recusabo duo in. Vis at laboramus expetendis."
        },
        {
          review_id: "000004",
          publishedAt: "1527341598",
          rating: "1",
          title: "Cheap swill",
          text: "His no moderatius disputationi, ut ubique nonumes pro. Ex clita dicant accusam vim, eos ut facer elitr tollit. Hinc animal option eu eos, mutat regione delenit an sed. In accusam adipisci mel. Ut quo cibo sanctus meliore. Ea mollis elaboraret vis, bonorum recusabo duo in. Vis at laboramus expetendis."
        }
      ]
      
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
  $(".js-home-screen").html(
    `
    <a href="#" onclick="loadAddScreen()">Add a New Wine</a><br>
    <a href="#" onclick="displayRecentReviews(MOCK_REVIEWS)">See Recent Reviews</a><br>
    <a href="#" onclick="browseWines(MOCK_REVIEWS)">Browse Wines</a>
    `
  )
}

function loadAddScreen() {
  $(".js-home-screen").css("display","none");
  $(".js-add-new-wine").css("display","block")
}


  $(".js-add-new-wine-form").submit(event => {
    event.preventDefault();
    var newWineReview = {
      wine: $("input[name='wine-name']").val(),
      year: $("input[name='wine-year']").val(),
      type: $("input[name='wine-type']").val(),
      region: $("input[name='wine-region']").val(),
      country: $("input[name='wine-country']").val(),
      rating: $("input[name='wine-rating']").val(), 
      title: $("input[name='headline']").val(),
      text: $("input[name='wine-review']").val()
    };
    MOCK_REVIEWS.push(newWineReview);
    $(".js-submit-status").html(`<p>Your review of ${newWineReview.wine} has been submitted.</p>`)
  })


function displayRecentReviews(data) {
  $(".js-home-screen").css("display","none");
  for (let i = 0; i < data.length; i++) {
    $(".js-recent-reviews").append(`<p><a href="#" onclick="displayFullReview(${data[i].wine_id})">${data[i].wine}</a> -- ${data[i].title}</p>`);
  }
}

function displayFullReview(reviewID) {
  $(".js-list-of-wines").empty();
  let thisReview = MOCK_REVIEWS.filter((element) => element.wine_id === reviewID);
  console.log(thisReview);
  $(".js-full-review").append(`<h2>${thisReview[0].title}</h2><p>${thisReview[0].text}</p>`);
}

function browseWines(data) {
  $(".js-home-screen").css("display","none");
  for (let i = 0; i < data.length; i++) {
    $(".js-list-of-wines").append(`<p><a href="#" onclick="displayFullReview('${data[i].wine_id}')">${data[i].year} ${data[i].wine}</a></p>`);
  }
}


listenforLogin();