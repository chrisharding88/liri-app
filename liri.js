
// Reads from the dotenv Package
require ("dotenv").config();

// imports the keys.js file and stores it as a variable
var keys = require("./keys.js");

// imports the spotify API so it can retrive the song information
var spotify = require('node-spotify-api');

var spotify = new spotify(keys.spotify);

// 
var axios = require("axios");

var fs = require("fs");

var moment = require("moment");

// This varable allows the user to enter the command 
var inputUser = process.argv[2];

var querySearch = process.argv.splice(3).join(" ");


// This allows the user to execute any command that is inputed in node.js such as 'concert-this', 'spotify-this-song'
// 'movie-this', & 'do-what-it-says'
function liriCommand(inputUser, querySearch){
  switch (inputUser){
    case "concert-this":
    concertThis(querySearch);
    break;
    case "spotify-this-song":
    spotifySong(querySearch);
    break;
    case "movie-this":
    movieThis(querySearch);
    break;
    case "do-what-it-says":
    doWhatItSays(querySearch);
    break;   

    default:
      console.log("Please enter the following commands: concert-this, spotify-this-song, movie-this, do-what-it-says")


  }
}

// Function that searches the BandInTown API whenever the user inputed 'concert-this'
function concertThis(musicArtist){

  // Stores the querysearch
  var musicArtist = querySearch;
  // Stores the URL in the varable 
  var bandsInTownURL = `https://rest.bandsintown.com/artists/${musicArtist}/events?app_id=codingbootcamp`;
 

  axios.get(bandsInTownURL).then(
          function(response){
            // Stores the data in variables
            var concertVenue = response.data[0].venue.name;
            var concertLocation = response.data[0].venue.city;
            var concertDate =  moment(response.data[0].datetime).format("MM-DD-YYYY");

            console.log("\n ------------SEARCHING FOR: " + musicArtist);

            // Displays the results 
            console.log("------------------------------------------");

            console.log(`\n Name of Venue: ${concertVenue}` );
            console.log(`\n Venue Location: ${concertLocation} `);
            console.log(`\n Date of Event: ${concertDate} `);

            console.log("------------------------------------------");
          
            // Stores in the variable plus it appends the file in log.txt
 var logConcertThis = ` \n ==============BEGIN CONCERT LOG =================
                        \n Name of Artist: ${musicArtist}
                        \n Name of Venue: ${concertVenue} 
                       \n Venue Location: ${concertLocation}  
                       \n Date of Event: ${concertDate}
                       \n===============END CONCERT LOG=========================`

    fs.appendFile("log.txt", logConcertThis, function(error){
              if(error) throw error;
          })

          })
  


    
};


// Function that searches the Spotify API whenever the user inputed 'spotify-this-song'
function spotifySong(songSearch){
  
  // If LIRI cant find the song, then it will display "The Sign"
  if (!songSearch){
    songSearch = "The Sign";
  }

  // Searches the song through the Spotify API to find the song that the user inputed in LIRI
  spotify.search({type: 'track', query: songSearch}, function(error, data){

    // Stores the data as variables
    var artistName = data.tracks.items[0].album.artists[0].name;
    var songTitle = data.tracks.items[0].name;
    var songLink = data.tracks.items[0].href;
    var album = data.tracks.items[0].album.name;

    if(error){
      return console.log('Error occured: '+ error)
    }

    // Displays the results
    console.log("-------------------------------------");

    console.log(`\n Artist(s) Name: ${artistName}`);
    console.log(`\n Song Title: ${songTitle}`);
    console.log(`\n Song Preview Link: ${songLink}`);
    console.log(`\n Album: ${album}`);

    console.log("-------------------------------------");

      // Stores in the variable plus it appends the file in log.txt
    var logSpotifyThisSong = `\n =======BEGIN SPOTIFY LOG ENTRY=========
                              \n Artist: ${artistName}
                              \n Song Title: ${songTitle}
                              \n Song Preview Link: ${songLink}
                              \n Album: ${album}
                              \n =======END SPOTIFY LOG==========`
  
    fs.appendFile("log.txt", logSpotifyThisSong, function(err){
      if(err) throw err;
    })


  })

};


// Function that searches the BandInTown API whenever the user inputed 'movie-this'
function movieThis(movieSearch){

  var movieSearch = querySearch;

  if (!movieSearch){
    movieSearch = "Mr. Nobody"
  }
 
  // Stores the URL into the variable
  var omdbMovieURL =`https://www.omdbapi.com/?t=${movieSearch}&apikey=trilogy`; 


// Makes the request through the Axios
axios.request(omdbMovieURL).then( 
  function(response){
    // Stores data in variable
    var movieTitle = response.data.Title;
    var movieYear = response.data.Year;
    var imdbRating = response.data.imdbRating;
    var rtRating = response.data.Ratings[1].value;
    var country = response.data.Country;
    var language = response.data.Language;
    var plot = response.data.Plot;
    var actors = response.data.Actors;

    // Displays the results
    console.log("----------------------------------------");

    console.log(`\n* Title: ${movieTitle}`);
    console.log(`\n* Year Released: ${movieYear}`);
    console.log(`\n* IMDB Rating: ${imdbRating}`);
    console.log(`\n* Rotten Tomatoes Rating: ${rtRating}`);
    console.log(`\n* Country Where Produced: ${country}`);
    console.log(`\n* Language(s): ${language}`);
    console.log(`\n* Plot: ${plot}`);
    console.log(`\n* Actors: ${actors}`);

    console.log("----------------------------------------");

  // Stores in the variable plus it appends the file in log.txt
   var logMovie = `\n============BEGIN MOVIE LOG ENTRY==============
                  \n Movie Title: ${movieTitle}
                  \n Year Released: ${movieYear}
                  \n Rotten Tomatoes Rating: ${rtRating}
                  \n Country Produced: ${country}
                  \n Lanuguage: ${language}
                  \n Plot: ${plot}
                  \n Actors: ${actors}
                  \n ============END MOVIE LOG ENTRY==============
                `

    fs.appendFile("log.txt", logMovie, function(error){
      if(error) throw error;
    });

  


  });


};


function doWhatItSays(){
      fs.readFile("random.txt", "utf-8", function(error, data){
          if(error){
            return console.log(error)
          } else {
            console.log(data);

            var random = data.split(",");
            liriCommand(random[0], random[1]);
          }
          fs.appendFile("log.txt", data, function(error){
            if (error) throw error;
          })

      });

      
}


 


// Callback the liriCommand function
liriCommand(inputUser, querySearch);
