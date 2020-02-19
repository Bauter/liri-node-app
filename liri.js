

// Required NPM packages
require("dotenv").config();
let moment = require("moment");
var Spotify = require('node-spotify-api');
let axios = require("axios");
var keys = require("./keys.js");
const inquirer = require("inquirer");
var fs = require("fs");

// Global Variables
let bandName;
let city;
let venueName;
let showDate;
let region;
let commandInput = process.argv[2];
let searchInput = process.argv.slice(3).join(" ");

// Run function set up to run commands based on arguments (primarily to make 'do-what-it-says' function properly)
function run(commandInput, searchInput) {
    
    switch (commandInput) {
        case 'concert-this':
            concertThisCommand(searchInput);
            break;
        case 'spotify-this-song':
            spotifyThisCommand(searchInput);
            break;
        case 'movie-this':
            movieThisCommand(searchInput);
            break;
        case 'do-what-it-says':
            doThisCommand();
            break;
        case 'command-list':
            start();
            break;
        default:
            // Argument options displayed every time 'liri.js' is run w/o commands
            console.log("please input a command\n");
            console.log("example: node liri.js <argument-1(command)> <argument-2>\n");
            console.log("commands:\n 1.'concert-this' + <band name>\n 2.'spotify-this-song' + <song name>\n 3.'movie-this' + <movie-name>\n 4.'do-what-it-says'\n 5.'command-list'\n");
            console.log("\n try command list for a user friendly experience");
    }
};

// Call 'run()' command with two variables as arguments to input process.argv[2] and process.argv[3].
run(commandInput, searchInput);

// Append user input to log.txt
let argOne = process.argv[2];
let argTwo = process.argv.slice(3).join(" ");
let input = "\n" + argOne + ", " + argTwo;
if (argOne === undefined) {
    input = "\nno-commands-entered-to-log";
}
fs.appendFile('log.txt', input, (err) => {
    if (err) throw err;
    console.log('\nlogged\n');
  });



// Start function runs when 'command-list' command is passed as process.argv[2]. to provide a more user guided experience.
function start() {
    // Inquirer NPM - Prompt questions to user.
    inquirer.prompt([
        {
            type:"list",
            name:"operation",
            message:"Please choose a function to run",
            choices: ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says", "exit"]
    
    }]).then(function(answer) {
        if (answer.operation == "concert-this") {
            concertThis();
        } else if (answer.operation == "spotify-this-song") {
            spotifyThis();
        } else if (answer.operation == "movie-this") {
            movieThis();
        } else if (answer.operation == "do-what-it-says") {
            doThis();
        } else if (answer.operation == "exit") {
            console.log("OK, see you later!")
        };
    });
};


// Prompted inquirer function for 'concert-this' via 'command-list' command.
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

            } else {
                return true
            }
         }
        }]
    ).then(function(response) {
        let run = true;
        let artistInput = response.artist;
        let cityInput = response.city;

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



// Prompted inquirer function for 'spotify-this-song' via 'command-list' command.
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

// Prompted inquirer function for 'movie-this' via 'command-list' command.
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

// Prompted inquirer function for 'do-what-it-says' via 'command-list' command.
function doThis() {
    doThisCommand();

}; // END OF "doThis" FUNCTION.

/* IF RUNNING "node liri.js" with arguments use THESE command functions with run() switch statements*/

function concertThisCommand(searchInput) {

    let artistInput = searchInput;

    axios.get("https://rest.bandsintown.com/artists/" + artistInput + "/events?app_id=codingbootcamp").then(function(response) {
       
        console.log("RESULTS: \n");

        for(let i = 0; i < response.data.length; i++){

            bandName = response.data[0].artist.name;
            showDate = moment(response.data[i].datetime).format("MMM Do YYYY");
            venueName = response.data[i].venue.name;
            city = response.data[i].venue.city;
            region = response.data[i].venue.region
                
            console.log("-----------------------------\n");
            console.log(" " + bandName + "\n  upcoming show # " + [i] + ":\n  " + showDate + " \n  In the city of: " + city + ", " + region + " \n  at: " + venueName + "\n");

            
            
        }; // END OF "for loop".

        console.log("-----------------------------");
        console.log("\n" + "^ ^ ^ Review the returned data above ^ ^ ^" + "\n");
        console.log("-----------------------------");


    });

}; // END OF 'concertThisCommand' FUNCTION

function spotifyThisCommand(searchInput) {

    let songInput = searchInput;
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
 
                });

            } else {

                console.log("\nHere's a list of Artists on spotify that match your search. \n");

                for(let i = 0; i < response.tracks.items.length; i++) {
                    console.log("------------- Match: "+[i]+" --------------\n");
                    console.log("Artist: " + response.tracks.items[i].artists[0].name + "\n"); // artist name
                    console.log("Song: " + response.tracks.items[i].name + "\n"); //song name
                    console.log("Album: " + response.tracks.items[i].album.name + "\n"); // album name
                    console.log("Preview URL: " + response.tracks.items[i].preview_url + "\n"); //preview url
                    console.log("--------------------------------------\n\n");
                };

            }; // END OF CONDITIONAL IF STATEMENT for songInput defined/undefined.
           
        })
        .catch(function(err) {
            console.log(err);
        }); // END OF "then" & "catch" Spotify.search PROMISE.

}; // END OF 'spotifyThisCommand' FUNCTION

 function movieThisCommand(searchInput) {
    let queryURL;
    let movieInput = searchInput;

    // If searchInput is undefined, pull 'Mr. Nobody' OMDB data
    if (!searchInput) {
         queryURL = "http://www.omdbapi.com/?t=Mr.+Nobody&y=&plot=short&apikey=trilogy"
    } else {
        queryURL = "http://www.omdbapi.com/?t=" + movieInput + "&y=&plot=short&apikey=trilogy"
        console.log(movieInput);
    };

        console.log(queryURL)
        axios.get(queryURL).then(function(response) {

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

        }).catch(function(error) {
            if (error.response) {
                console.log("error #1: " + error.response);
            } else if (error.request) {
                console.log("error #2: " + error.request);
            } else if (error.message) {
                console.log("error #3: " + error.message);
            };

        });
    
}  // END OF 'movieThisCommand' FUNCTION 

function doThisCommand() {
    fs.readFile('random.txt', 'utf-8', (err,data) => {
        if(err) {
           console.log(err)
        } else {
            let randomData = data.split(",");
            run(randomData[0], randomData[1])
        
        }
       
    });

    

}; // END OF 'doThisCommand' FUNCTION
 