// Required NPM packages
require("dotenv").config();
let moment = require("moment");
var Spotify = require('node-spotify-api');
let axios = require("axios");
var keys = require("./keys.js");
const inquirer = require("inquirer");

// Global Variables
let matchedConcerts = [];
let bandName;
let city;
let venueName;
let showDate;
let region;

// ??? unsure if needed, came from HW instructions? ???

// var spotify = new Spotify(keys.spotify);
// spotify
// .search({ type: 'track', query: 'All the Small Things' })
// .then(function(response) {
//     console.log(response.);
// })
// .catch(function(err) {
//     console.log(err);
// });


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
                    console.log(bandName + " Upcoming shows: " + showDate + " In the city of: " + city + " at: " + venueName);

                }; // END OF "if statement".
                
            }; // END OF "for loop".
            
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

concertThis();
