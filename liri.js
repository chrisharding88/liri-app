require ("dotenv").config();

var keys = require("./keys.js");

var spotify = require('node-spotify-api');

var spotify = new spotify(keys.spotify);