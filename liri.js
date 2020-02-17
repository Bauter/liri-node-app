require("dotenv").config();
let moment = require("moment");

//let date = moment().format("MMM Do YY");

var keys = require("./keys.js");
let matchedConcerts = [];
var Spotify = require('node-spotify-api');

var spotify = new Spotify(keys.spotify);

const inquirer = require("inquirer");

let axios = require("axios");

// spotify
// .search({ type: 'track', query: 'All the Small Things' })
// .then(function(response) {
//     console.log(response.);
// })
// .catch(function(err) {
//     console.log(err);
// });

function concertThis() {
    inquirer.prompt([
        { 
         type:"input",
         name:"artist",
         message:"What artist would you like to search for?"
        },
        {
         type:"input",
         name:"city",
         message:"What city are you in?"
        }]
        ).then(function(response) {
        let artistInput = response.artist;
        let cityInput = response.city;
        cityInput.charAt(0).toUpperCase();
        artistInput.charAt(0).toUpperCase();
        
        axios.get("https://rest.bandsintown.com/artists/" + artistInput + "/events?app_id=codingbootcamp").then(function(response) {
            console.log("Band: " + response.data[0].artist.name);
            let date = moment(response.data[0].datetime).format("MMM Do YYYY")
            console.log(date);
            console.log(response.data[0].venue);

            console.log(cityInput, 'this');
            let city = response.data[0].venue.city
            for(let i = 0; i < response.data.length; i++){
                if(response.data[i].venue.city === cityInput){
                    matchedConcerts.push(response.data[i])
                }
                
            }
            console.log(matchedConcerts)

        });

    })

}

concertThis();
