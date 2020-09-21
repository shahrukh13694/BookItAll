/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require("express");
var cfenv = require("cfenv");
// create a new express server
var app = express();
// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, "0.0.0.0", function () {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});

// serve the files out of ./public as our main files
app.use(express.static(__dirname + "/public"));

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv

const tmdb = require("tmdbv3").init("<API KEY>");
var Cloudant = require("@cloudant/cloudant");
var nodemailer = require("nodemailer");
var qr = require("qr-image");

//Connecting to cloudant
var me = "<API/Connection Key>";
var password = "<Secret>";

var cloudant = Cloudant({ account: me, password: password });

cloudant.db.list(function (err, allDbs) {
  //console.log('All my databases: %s', allDbs.join(', '))
});

app.get("/getConfirmation", function ab(request, res) {
  var date = request.query.date;
  var timing = request.query.timing;
  var movieName = request.query.movieName;
  var state = request.query.state;
  var suburb = request.query.suburb;
  //var cinema = request.query.cinema;
  var qty = request.query.qty;
  var sendTo = request.query.email;
  console.log("point 1");
  var str = movieName + "-" + date + "-" + timing + "-" + state + "-" + suburb;
  //var code = qr.image(str);
  console.log("point 2");
  res.send("success");

  //var qr_svg = qr.image(str, { type: 'png' });
  //qr_svg.pipe(require('fs').createWriteStream(__dirname + '//public/images//1.png'));
  //var svg_string = qr.imageSync(str, { type: 'png' });
  /*
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: '',
      pass: ''
    }
  });
  var mailOptions = {
    from: '',
    to: sendTo,
    subject: 'Thank you for booking tickets from Book it all',
    html: '<h1>Here are your booking details</h1><p>Movie: ' + movieName + '</p><p>Venue: ' + cinema +', '+ suburb + ', ' + state + '</p><p>Date: ' + date + '</p><p>timing: ' + timing + '</p><p>Number of tickets: ' + qty + '</p><p>Please show this QR code to gain entry in the cinema hall.</p><img src="cid:idimg"/>',
    attachments: [{
      filename: '1.png',
      path: __dirname +'/public/images/1.png',
      cid: 'idimg' 
 }]
  };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
*/
});

app.get("/getMovieTrailerLink", function (request, res) {
  console.log("getMovieTrailerLink is called");
  var movieId = request.query.id;
  getMovieTrailerLink(movieId, function (result) {
    res.send(result);
  });
});

app.get("/getMovieDetails", function (request, res) {
  console.log("getMovieDetails is called");
  var movieId = request.query.id;
  getMovieTmdbData(movieId, function (result) {
    res.send(result);
  });
});

app.get("/getShowsData", function (request, res) {
  console.log("getShowsData called.");
  var state = request.query.state;
  var suburb = request.query.suburb;
  //var cinema = request.query.cinema;
  getShowValues(state, suburb, function (result) {
    console.log(result);
    res.send(result);
  });
});

class tmdbMovieData {
  constructor(id) {
    this.id = id;
  }

  set movieTitle(moviename) {
    this._movieTitle = moviename;
  }
  get movieTitle() {
    return this._movieTitle;
  }

  set isAdult(type) {
    this._isAdult = type;
  }
  get isAdult() {
    return this._isAdult;
  }

  set genres(genres) {
    this._genres = genres;
  }
  get genres() {
    return this._genres;
  }

  set homepagelink(homepagelink) {
    this._homepagelink = homepagelink;
  }
  get homepagelink() {
    return this._homepagelink;
  }

  set overview(overview) {
    this._overview = overview;
  }
  get overview() {
    return this._overview;
  }

  set posterLink(posterLink) {
    this._posterLink = posterLink;
  }
  get posterLink() {
    return this._posterLink;
  }

  set releaseDate(releaseDate) {
    this._releaseDate = releaseDate;
  }
  get releaseDate() {
    return this._releaseDate;
  }

  set runtime(runtime) {
    this._runtime = runtime;
  }
  get runtime() {
    return this._runtime;
  }

  set rating(rating) {
    this._rating = rating;
  }
  get rating() {
    return this._rating;
  }
}

function getMovieTmdbData(movieId, fn) {
  tmdb.movie.info(movieId, (err, res) => {
    var movieObj = new tmdbMovieData(movieId);
    movieObj.movieTitle = res.title;
    movieObj.isAdult = res.adult;
    movieObj.homepagelink = res.homepage;
    movieObj.overview = res.overview;
    movieObj.releaseDate = res.release_date;
    movieObj.runtime = res.runtime;
    movieObj.rating = res.vote_average;

    var genres = "";
    for (var i = 0; i < res.genres.length; i++) {
      if (i == res.genres.length - 1) {
        genres += res.genres[i].name;
      } else {
        genres += res.genres[i].name + ", ";
      }
    }
    movieObj.genres = genres;

    var posterLink = "https://image.tmdb.org/t/p/w342/";
    posterLink += res.poster_path;
    movieObj.posterLink = posterLink;

    fn(movieObj);
  });
}

function getMovieTrailerLink(movieId, fn) {
  tmdb.movie.trailers(movieId, (err, response) => {
    var trailerYoutubeLink = "https://www.youtube.com/watch?v=";
    for (var i = 0; i < response.youtube.length; i++) {
      if (response.youtube[i].type == "Trailer")
        trailerYoutubeLink += response.youtube[i].source;
    }
    fn(trailerYoutubeLink);
  });
}

/*
getMovieTmdbData(420817, function (result){
  console.log("from outside");
  console.log(result.movieTitle);
});

getMovieTrailerLink(420817, function (result){
  console.log("from outside");
  console.log(result);
});
*/

//Searching from cloudant database documents
var db = cloudant.db.use("fillers");
var userdb = cloudant.db.use("userdb");

function getLocationValues() {
  db.find({ selector: { name: "fillers" } }, function (err, result) {
    if (err) {
      throw err;
    }

    for (var i = 0; i < result.docs[0].states.length; i++) {
      console.log("State: " + result.docs[0].states[i].state);

      for (var j = 0; j < result.docs[0].states[i].suburbs.length; j++) {
        console.log("Suburbs :" + result.docs[0].states[i].suburbs[j]);
      }
    }
  });
}

function getLanguageValues() {
  db.find({ selector: { name: "fillers" } }, function (err, result) {
    if (err) {
      throw err;
    }

    for (var i = 0; i < result.docs[0].language.length; i++) {
      console.log("language: " + result.docs[0].language[i]);
    }
  });
}

//This function takes in the filters state, suburb and cinema and collates an object to return to the calling function.
//This object contains all the data relating to the movie and timings.
function getShowValues(state, suburb, fn) {
  //cinema
  db.find({ selector: { name: "showsData" } }, function (err, result) {
    if (err) {
      throw err;
    }
    var final = [];
    //console.log("Show Data: ");
    for (var i = 0; i < result.docs[0].shows.length; i++) {
      //console.log(result.docs[0].shows[i]);
      var temp = result.docs[0].shows[i];
      if (
        temp.venue.state.toLowerCase() == state.toLowerCase() &&
        temp.venue.suburb.toLowerCase() == suburb.toLowerCase()
      ) {
        //&& temp.venue.cinema.toLowerCase() == cinema.toLowerCase()
        console.log("found");
        console.log(state + suburb);
        final.push(result.docs[0].shows[i]);
      } else {
        console.log("NOT");
      }
    }

    if (final.length == 0) {
      final = null;
    }
    fn(final);
  });
}

function getUserValues() {
  userdb.find({ selector: { name: "userData" } }, function (err, result) {
    if (err) {
      throw err;
    }

    console.log("User Data:");

    for (var i = 0; i < result.docs[0].users.length; i++) {
      console.log(result.docs[0].users[i]);
    }
  });
}

//getLocationValues();
//getLanguageValues();

//getUserValues();

/*transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
*/
