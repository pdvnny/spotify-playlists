// controllers/spotify_api.js

const axios = require('axios');
const jwt = require('jsonwebtoken');
const querystring = require('querystring');
const path = require("path");
const dotenv = require('dotenv');

/* Import Config File */
// console.log(path.resolve(__dirname, '..'));
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
// console.log("Client ID: ", client_id);
// console.log("Client Secret: ", client_secret);

/* HELPER FUNCTIONS */
const request_basic_access_token = async () => {
    const endpoint = "https://accounts.spotify.com/api/token";
    // const header = {
    //     headers: {
    //         Authorization: "Basic " + Buffer.from(client_id + ":" + client_secret).toString("base64"),
    //         'Content-Type': 'application/x-www-form-urlencoded'
    //     }
    // };
    // const response = await axios.post(
    //     endpoint,
    //     querystring.stringify({ grant_type: "client_credentials" }),
    //     header
    // );
    const header = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    const data = querystring.stringify({
        grant_type: "client_credentials",
        client_id: client_id,
        client_secret: client_secret
    });
    const response = await axios.post(endpoint, data, header);

    return response.data.access_token;
}


/* SAMPLE INPUTS */
const artist = "Beastie Boys";
const track = "No Sleep Till Brooklyn";
const album = "";

/*****************************************************
 * SEARCH SPOTIFY FOR A TRACK THAT MATCHES SEARCH
 * PARAMETERS THAT MAY INCLUDE ARTIST, TRACK, AND ALBUM
 *
 *    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *    CURRENTLY DOES NOT WORK BECAUSE /search
 *    REQUIRES OAUTH2.0 AUTHENTICATION
 *    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *
 * @param access_token An access token retrieved from
 *                     Spotify's API
 * @param artist
 * @param track
 * @param album
 * @returns
 *****************************************************/
const searchSpotify = async (access_token, artist, track, album) => {
    const endpoint = "https://api.spotify.com/v1/search";

    let user_search_string = "";
    if (artist !== "" && artist != null) {
        user_search_string += "artist:" + artist;
    }
    if (track !== "" && track != null) {
        user_search_string += " track:" + track;
    }
    if (album !== "" && album != null) {
        user_search_string += " album:" + album;
    }
    let user_search = encodeURIComponent(user_search_string);

    console.log("User's Search Encoded: ", user_search)
    console.log("User's Search as String: ", user_search_string);

    const query = querystring.stringify({
        'q': user_search,
        'type': ["track"],
        'market': "US"
    });
    const basicHeader = Buffer.from(access_token).toString("base64");
    const header = {
        headers: {
            Authorization: "Bearer " + basicHeader
        }
    };

    const response = await axios.get(endpoint + "?" + query, header);
    console.log("Status: ", response.status);

    return response.data
}

/*******************************************
    main()
 *******************************************/

/* TESTING ABILITY TO DO A SIMPLE SEARCH */
// No user authentication required
const performSearch = async () => {
    let access_token = await request_basic_access_token();
    console.log("Access Token: ", access_token);
    let searchResults = searchSpotify(access_token, artist, track, album);
};
// performSearch();


