// Required NPM packages
require("dotenv").config();
let moment = require("moment");
var Spotify = require('node-spotify-api');
let axios = require("axios");
var keys = require("./keys.js");
const inquirer = require("inquirer");

// Global Variables
let bandName;
let city;
let venueName;
let showDate;
let region;

// Start function, runs when node runs the "liri.js" file and gives user choice of operation to run.
function start() {
    // Inquirer NPM - Prompt questions to user.
    inquirer.prompt([
        {
            type:"list",
            name:"operation",
            message:"Please choose a function to run",
            choices: ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says"]
    
    }]).then(function(answer) {
        if (answer.operation == "concert-this") {
            concertThis();
        } else if (answer.operation  == "spotify-this-song") {
            spotifyThis();
        } else if (answer.operation  == "movie-this") {
            movieThis();
        } else if (answer.operation  == "do-what-it-says") {
            //do-what-it-says function call
        };
    });
};


// ConcertThis function to take user artist and city input via inquirer, search "bands-in-town" API via Axios, and log results
function concertThis() {

    // Inquirer NPM - Prompt questions to user.
    inquirer.prompt([
        { 
         type:"input",
         name:"artist",
         message:"What artist would you like to search for?",
         // User validation function
         validate: function(value) {
            if (value == "") {
                return "Please enter an artist"
            } else {
                return true
            }
         }
        },
        {
         type:"input",
         name:"city",
         message:"What city are you in? (please capitalize first letter)",
         // User validation function
         validate: function(value) {
            if (value == "") {
                return "Please enter a city"
            // } else if (value.charAt(0) = "a" ||"b"|| "c"|| "d"|| "e"|| "f"|| "g"|| "h"|| "i"|| "j"|| "k"|| "l"|| "m"|| "n"|| "o"|| "p"|| "q"|| "r"|| "s"|| "t"|| "u"|| "v"|| "w"|| "x"|| "y"|| "z") {
            //     return "Please capitalize the first letter in city name"
            } else {
                return true
            }
         }
        }]
    ).then(function(response) {
        let run = true;
        let artistInput = response.artist;
        let cityInput = response.city;
        // cityInput.toUpperCase();
        // artistInput.toUpperCase(); // trouble with city name not having first letter capitalized.... needs work

        console.log("RESULTS: ")

        // Axios used for "bands-in-town" API
        
        axios.get("https://rest.bandsintown.com/artists/" + artistInput + "/events?app_id=codingbootcamp").then(function(response) {
           
            // For loop to loop through response data
            for(let i = 0; i < response.data.length; i++){

                bandName = response.data[0].artist.name;
                showDate = moment(response.data[i].datetime).format("MMM Do YYYY");
                venueName = response.data[i].venue.name;
                city = response.data[i].venue.city;
                region = response.data[i].venue.region;

                if(response.data[i].venue.city === cityInput){
                    
                    // IF CITY MATCH FOUND log:
                    console.log("----------------------");
                    console.log("\n!!! MATCH FOUND !!!\n" + "\n" + bandName + "\nIs playing at: " + venueName + "\nIn: " + city + ", " + region + "\nOn: " + showDate + "\n" + "\n!!! MATCH FOUND !!!\n");
                    console.log("----------------------");
                    
                } else if(response.data[i].venue.city !== cityInput) {
                   
                    // IF NO CITY MATCHES FOUND log:
                    console.log(bandName + " Upcoming shows: " + showDate + " In the city of: " + city + " at: " + venueName + "\n");

                }; // END OF "if statement".
                
            }; // END OF "for loop".

            console.log("\n" + "^ ^ ^ Review the returned data above ^ ^ ^" + "\n");
            console.log("-----------------------------");
            console.log("\n" + "when ready, proceed with next operation choice" + "\n");
            console.log("-----------------------------\n");
            if( run == true) {
                start()
            }
        }); // END OF "Axios" CALL.

    }).catch(function(error) {
        if (error.response) {
            console.log("error #1: " + error.response);
        } else if (error.request) {
            console.log("error #2: " + error.request);
        } else if (error.message) {
            console.log("error #3: " + error.message);
        };
    }); // END OF "then" & "catch" PROMISE.

}; // END OF "concertThis" FUNCTION.

//concertThis();
start();

function spotifyThis() {
    
    console.log("\nLets search Spotify for a song...\n")

    // Inquirer NPM - Prompt questions to user.
    inquirer.prompt([
        { 
            type:"input",
            name:"song",
            message:"What song would you like to search for?",
            // User validation function
            validate: function(value) {
               if (value == "") {
                   return "Please enter a song name"
               } else {
                   return true
               }
            }
        }
    ]).then(function(songSearch) {

        let songInput = songSearch.song;
        var spotify = new Spotify(keys.spotify);

        // Node-spotify-api search.
        spotify.search(
            {
                 type: 'track', 
                 query: songInput 
            }
        ).then(function(response) {
           
            if (songInput = undefined) {

                // Default spotify search
                spotify.search(
                    {
                        type: 'track',
                        query: "The Sign"
                    }
                ).then(function(defaultResponse){

                    run = true;

                    console.log("--------------------------------------\n");
                    console.log("Artist: " + defaultResponse.tracks.items[0].artists[0].name + "\n"); // artist name
                    console.log("Song: " + defaultResponse.tracks.items[0].name + "\n"); //song name
                    console.log("Album: " + defaultResponse.tracks.items[0].album.name + "\n"); // album name
                    console.log("Preview URL: " + defaultResponse.tracks.items[0].preview_url + "\n"); //preview url
                    console.log("--------------------------------------\n");

                    if(run == true) {

                        console.log("\n" + "^ ^ ^ Review the returned data above ^ ^ ^" + "\n");
                        console.log("-----------------------------");
                        console.log("\n" + "When ready, proceed with next operation choice" + "\n");
                        console.log("-----------------------------\n");
        
                       start();
                    };
                });

            } else {

                let run = true;

                console.log("\nHere's a list of Artists on spotify that match your search. \n");

                for(let i = 0; i < response.tracks.items.length; i++) {
                    console.log("------------- Match: "+[i]+" --------------\n");
                    console.log("Artist: " + response.tracks.items[i].artists[0].name + "\n"); // artist name
                    console.log("Song: " + response.tracks.items[i].name + "\n"); //song name
                    console.log("Album: " + response.tracks.items[i].album.name + "\n"); // album name
                    console.log("Preview URL: " + response.tracks.items[i].preview_url + "\n"); //preview url
                    console.log("--------------------------------------\n\n");
                };

                if (run == true) {

                    console.log("\n" + "^ ^ ^ Review the returned data above ^ ^ ^" + "\n");
                    console.log("-----------------------------");
                    console.log("\n" + "When ready, proceed with next operation choice" + "\n");
                    console.log("-----------------------------\n");

                    start();

                };
            }; // END OF CONDITIONAL IF STATEMENT for songInput defined/undefined.
           
        })
        .catch(function(err) {
            console.log(err);
        }); // END OF "then" & "catch" Spotify.search PROMISE.

    }); // END OF "then" Inquirer PROMISE.

}; // END OF "spotifyThis" FUNCTION.


function movieThis() {

    // Inquirer NPM - Prompt questions to user.
    inquirer.prompt([
        { 
            type:"input",
            name:"movie",
            message:"What movie would you like to search for?",
            // User validation function
            validate: function(value) {
               if (value == "") {
                   return "Please enter a movie name"
               } else {
                   return true
               }
            }
        }
    ]).then(function(movieSearch){

        let movieInput = movieSearch.movie

        axios.get("http://www.omdbapi.com/?t=" + movieInput + "&y=&plot=short&apikey=trilogy").then(function(response) {

            if (response.data.Title == undefined) {

                let movieInput = "Mr. Nobody";
            
                axios.get("http://www.omdbapi.com/?t=" + movieInput + "&y=&plot=short&apikey=trilogy").then(function(response) {

                    run = true;

                    console.log("\nSorry, we couldn't find that movie, so we searched this one instead. Check it out!\n")

                    console.log("\n-----------------------------");
                    console.log("\nMovie: " + response.data.Title); // Movie title.
                    console.log("\nRelease date: " + response.data.Released); // Release date.
                    console.log("\nIMDB-rating: " + response.data.imdbRating); //Movie imdb rating.
                    console.log("\n" + response.data.Ratings[1].Source + " rating: " + response.data.Ratings[1].Value); // Rotten Tomatoes rating.
                    console.log("\nCountry produced in: " + response.data.Country); // Country where the movie was produced.
                    console.log("\nLanguage: " + response.data.Language); // Language of the movie.
                    console.log("\nPlot: " + response.data.Plot); // Plot of the movie.
                    console.log("\nActors: " + response.data.Actors); // Actors in the movie.
                    console.log("\n-----------------------------");

                    if(run == true) {

                        console.log("\n" + "^ ^ ^ Review the returned data above ^ ^ ^" + "\n");
                        console.log("-----------------------------");
                        console.log("\n" + "When ready, proceed with next operation choice" + "\n");
                        console.log("-----------------------------\n");
        
                       start();
                    };

                }).catch(function(error) {
                    if (error.response) {
                        console.log("error #1: " + error.response);
                    } else if (error.request) {
                        console.log("error #2: " + error.request);
                    } else if (error.message) {
                        console.log("error #3: " + error.message);
                    };
        
                }); // END OF "then" & "catch" Axios PROMISE for DEFAULT movie search.

            } else {
                run = true;

                console.log("\n-----------------------------");
                console.log("\nMovie: " + response.data.Title); // Movie title.
                console.log("\nRelease date: " + response.data.Released); // Release date.
                console.log("\nIMDB-rating: " + response.data.imdbRating); //Movie imdb rating.
                console.log("\n" + response.data.Ratings[1].Source + " rating: " + response.data.Ratings[1].Value); // Rotten Tomatoes rating.
                console.log("\nCountry produced in: " + response.data.Country); // Country where the movie was produced.
                console.log("\nLanguage: " + response.data.Language); // Language of the movie.
                console.log("\nPlot: " + response.data.Plot); // Plot of the movie.
                console.log("\nActors: " + response.data.Actors); // Actors in the movie.
                console.log("\n-----------------------------");

                if(run == true) {

                    console.log("\n" + "^ ^ ^ Review the returned data above ^ ^ ^" + "\n");
                    console.log("-----------------------------");
                    console.log("\n" + "When ready, proceed with next operation choice" + "\n");
                    console.log("-----------------------------\n");
    
                   start();
                };

            }; // END OF CONDITIONAL IF STATEMENT for "response.data.Title" defined/undefined.
                

        }).catch(function(error) {
            if (error.response) {
                console.log("error #1: " + error.response);
            } else if (error.request) {
                console.log("error #2: " + error.request);
            } else if (error.message) {
                console.log("error #3: " + error.message);
            };

        }); // END OF "then" & "catch" Axios PROMISE.

    }); // END OF "then" Inquirer PROMISE.

}; // END OF "movieThis" FUNCTION.