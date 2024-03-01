// routes/auth.js

// IMPLEMENTING AUTHENTICATION ROUTES FOR SPOTIFY

const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');

const stateKey = 'spotify_auth_state';
const app_scope = "playlist-modify-public playlist-modify-private user-read-private user-read-email";

const router = express.Router();


/* !!! MISSING !!! */
/*
    For additional security there should probably
    be some use of jsonwebtoken.

    I did this with 'passport' in the other example
    that I completed. In this case, I think I should
    try to work off the "inplainenglish" Spotify tutorial
    or the Spotify API documentation

    e.g. (from previous example)
    // created middlewares/passport.js and had the following here

    const passport = require('passport');

    const jwtRequired = passport.authenticate('jwt', { session: false });

    then at various routes (e.g., /private-route) you can work with
    the jwt to confirm the ID of the current user has not changed.
*/

/*******************************************
    HELPER FUNCTIONS
 *******************************************/
/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = function(length) {
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};


/*******************************************
    REQUEST AUTHORIZATION
 *******************************************/
/*
    Requests authorization to access a user's Spotify account
    (Normally not a fully defined function. Simply provided with
     a call to express.get() - see below for more details)
 */
const authorize = function(req, res) {
    // debugging
    // console.log("Running authorize method")

    let state = generateRandomString(16);
    res.cookie(stateKey, state);

    let query_params = new URLSearchParams({
        response_type: 'code',
        client_id: process.env.SPOTIFY_CLIENT_ID,
        scope: app_scope,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        state: state
    });

    // console.log("Debugging");
    // console.log(query_params);

    // your application requests authorization
    // let scope = app_scope;
    res.redirect('https://accounts.spotify.com/authorize?' + query_params.toString());
}

/*******************************************
    REQUEST ACCESS TOKEN
 *******************************************/
// Requests an access token after the user has authorized
// this application to acccess their spotify account
// (Technically doesn't require access to the Spotify account)

const request_token = async function(req, res) {
    // for debugging purposes
    // console.log(req);  // this is too massive to log; not helpful
    console.log("'request_token' request query: ");
    console.log(req.query);
    // console.log(req.cookies);  // undefined!!
    console.log("'request_token' request session");
    console.log(req.session) // Logs "Session {}" ... so empty

    // Information about the request via callback from Spotify
    

    // retrieves code response in URL params
    // after user authorization
    let code = req.query.code || null;      // Authorization code return from the previous request
    let state = req.query.state || null;

    /*
        Cookies are not working rn!!
        Need to review tutorial to get this sorted!
    */
    // let storedState = req.cookies ? req.cookies[stateKey] : null;   I need to figure out 

    // if (state === null || state !== storedState) {
    if (state === null) {
        res.redirect('/#' + new URLSearchParams({
            error: 'state_mismatch'
        }).toString());
    } else {
        // res.clearCookie(stateKey);
        let url = 'https://accounts.spotify.com/api/token';
        const basicHeader = Buffer.from(process.env.SPOTIFY_CLIENT_ID + 
                                        ':' + 
                                        process.env.SPOTIFY_CLIENT_SECRET).toString('base64');
        let header = {
            headers: {
                Authorization: `Basic ${basicHeader}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        let form = new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: process.env.SPOTIFY_REDIRECT_URI   // I THINK I NEED TO CHANGE THIS
        }).toString();

        /*
            POST request to get access_token and refresh_token
        */
        // let response = await axios.post(url, form, header);
        const {data} = await axios.post(url, form, header);

        /*
            Store access_token and refresh_token in session cookie
         */
        const sessionJWTObject = {
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            expires_in: data.expires_in,
            token_type: data.token_type,
            expiration: new Date().getTime() + (data.expires_in * 1000) - 10000  // in milliseconds
        };

        req.session.jwt = jwt.sign(sessionJWTObject, process.env.JWT_SECRET);

        return res.redirect('/manage');
    }
}

const refresh_access_token = async function(req, res) {
    // fetching the current session data again
    let decodedInfo;
    jwt.verify(
        req.session.jwt,
        process.env.JWT_SECRET,
        (err, decodedToken) => {
            if (err || !decodedToken) {
                res.send(null);
                // decodedInfo = null;
            } else {
                // res.send(decodedToken);
                decodedInfo = decodedToken;
            }
    });

    let url = 'https://accounts.spotify.com/api/token';
    const authorizationInfo = (new Buffer.from(process.env.SPOTIFY_CLIENT_ID + 
                            ':' + 
                            process.env.SPOTIFY_CLIENT_SECRET).toString('base64'));
    let header = {
        headers: {
            Authorization: `Basic ${authorizationInfo}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    let body = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: decodedInfo.refresh_token
    }).toString();

    const data = await axios.post(url, body, header)
        .then((response) => {
            console.log('Return from Spotify on request to refresh token:');
            // console.log('Status:', response.status);
            let resData = response.data;
            console.log('Data', resData);
            return resData;
        })
        .catch((error) => console.log({
            "status": error.status,
            "error": error.message
        }));

    const sessionJWTObject = {
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            expires_in: data.expires_in,
            token_type: data.token_type,
            expiration: new Date().getTime() + (data.expires_in * 1000) - 10000  // in milliseconds
    };
    req.session.jwt = jwt.sign(sessionJWTObject, process.env.JWT_SECRET);

    return res.send(sessionJWTObject);
}

/*******************************************
    main()
 *******************************************/

/* *** NOTE *** */
// '/token' is actually '/auth/token'
// '/'     ========>    '/auth/'
// Due to the configuration in server.js

router.get(
    '/basic-token',
    (req, res, next) => {
        const url = 'https://accounts.spotify.com/api/token'
        const header = {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
        const body = new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: process.env.SPOTIFY_CLIENT_ID,
            client_secret: process.env.SPOTIFY_CLIENT_SECRET
        }).toString();

        // console.log(body); // temp for debugging
        // console.log(header);

        // POST request to get access_token and refresh_token
        // Copied from "Building a Spotify API Searcher in React" (YouTube)
        fetch(url, {method: 'POST', body: body, headers: header})
            .then((result) => result.json())
            .then((data) => {
                console.log(data); // temp for debugging
                return res.send(data);
            });

        // Store access_token and refresh_token in session cookie
        // const sessionJWTObject = {
        //     access_token: data.access_token
        // };;
    }
)

router.get('/login', authorize);
router.get('/callback', request_token);
router.get('/refresh-access-token', refresh_access_token);
router.get('/current-session', (req, res) => {
    let decodedInfo;
    jwt.verify(
        req.session.jwt,
        process.env.JWT_SECRET,
        (err, decodedToken) => {
            if (err || !decodedToken) {
                res.send(null);
                // decodedInfo = null;
            } else {
                // res.send(decodedToken);
                decodedInfo = decodedToken;
            }
    });
    let now = new Date().getTime();
    if (decodedInfo && now < decodedInfo.expiration) {
        res.send(decodedInfo);
    } else {
        // DEBUGGING
        console.log("Attempting to refresh token");
        // console.log("Information about the current session:", decodedInfo);
        console.log("Expiration time of previous session: ");
        console.log(new Date(decodedInfo.expiration).toString());


        res.redirect('/auth/refresh-access-token');
    }
});

router.get('/logout', (req, res) => {
    req.session = null;
    res.redirect('/');
});

module.exports = router;
