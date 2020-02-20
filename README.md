# Liri-node-app
LIRI is a command line node app.

LIRI will search Spotify for songs, Bands in Town for concerts, and OMDB for movies.
## What you will need ##

-explanations to follow

1. A code editor, I prefer Visual Studio Code ("https://code.visualstudio.com/").
2. Node.js to run node commands in terminal ("https://nodejs.org/en/download/").
3. '.gitignore' file to write what files you would not like to upload.
4. '.env' file, to store private API keys (spotify_ID & spotify_secret).
5. 'keys.js' file to export 'spotify' object with id and secret keys.
6. NPM packages 'inquirer', 'axios', 'node-spotify-api', 'moment', 'DotEnv', & 'fs'.
7. 'OMDB API' ("http://www.omdbapi.com") & 'Bands in Town API' ("http://www.artists.bandsintown.com/bandsintown-api").
8. 'package.json' file.
9. 'random.txt' and 'log.txt' files.
10. Spotify developer account (to obtain client ID and secret). Visit ("https://developer.spotify.com/my-applications/#!/").

##  Lets get started ##

1. Create a project folder (to save time you can clone this repository and skip the steps you don't need.)
-Create files named:
"liri.js"
"keys.js"
".env"
"random.txt"
"log.txt"
".gitignore"

2. In the root of your project folder in terminal and run "npm init -y". This will initialize a "package.json" file for your project. (this is required to install npm packages).

3. Inside your '.gitignore' file add the following lines. (this will prevent git from uploading these files).
-'node_modules'
-'.DS_Store'
-'.env'

4. Inside "keys.js".
-Add the following:

```
console.log("this is loaded");

exports.spotify = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
};

```
5. Inside ".env".
-Add the following:

```
# Spotify API keys

SPOTIFY_ID=your-spotify-id
SPOTIFY_SECRET=your-spotify-secret

```
-Replace the values with your API keys from ("https://developer.spotify.com/my-applications/#!/").

6. Inside "random.txt".
-Add the following:

spotify-this-song,"I Want it That Way"

7. Inside terminal once again Install all  relevant NPM packages via the following command:

npm i inquirer
npm i moment
npm i node-spotify-api
npm i axios

8. Inside "liri.js" add to the top of your page.
-Add the following:

require("dotenv").config();
let moment = require("moment");
var Spotify = require('node-spotify-api');
let axios = require("axios");
var keys = require("./keys.js");
const inquirer = require("inquirer");
var fs = require("fs");

9. When creating your spotify function add the following variable to access your API keys.

var spotify = new Spotify(keys.spotify);

10. Make it so when running 'node liri.js' in terminal, you can add the following as arguments for process.argv[2].

'concert-this'

'spotify-this-song'

'movie-this'

'do-what-it-says'

## What each command should do ##
