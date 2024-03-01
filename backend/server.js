/*
    Parker Dunn (parker_dunn@outlook.com)
    September 2023

    Creating a web application that I can use
    to access Spotify Information via the
    Spotify Web API

*/

const express = require('express'); // Express web server framework
const session = require('cookie-session'); // Cookie Session middleware

/* Security middleware */
const helmet = require('helmet');   // Helmet helps you secure your Express apps by setting various HTTP headers.
const hpp = require('hpp');         // Prevent HTTP Parameter pollution.
const csurf = require('csurf');     // Cross-Site Request Forgery protection.

const dotenv = require('dotenv');
const path = require('path');

/* Database packages */
const mongoose = require('mongoose');

// Suggested and not used for now
//  const bodyParser = require('body-parser'); // Parse incoming request bodies in a middleware before your handlers, available under the req.body property.

/*******************************************
    HELPER FUNCTIONS
 *******************************************/
/*
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
    CONFIGURATIONS
 *******************************************/

/* Database configuration */
const database_uri = "mongodb+srv://pdunn91:kb2uu9z0hBluJvhf@volo-play-dev.hsbm6cs.mongodb.net/?retryWrites=true&w=majority";

/* Import Config File */
dotenv.config({ path: path.resolve(__dirname, '../.env') });

/* Security/session configuration stuff */
const stateKey = 'spotify_auth_state';
let authorization_code = null;
// let stateKey = 'spotify_auth_state';   // save "stateKey:state" pair as cookie

/* Create Express App */
const app = express();

/* Allow JSON at API endpoints */
app.use(express.json());

/* Set Security Configs */
app.use(helmet());
app.use(hpp());

/* Set Cookie Settings */
app.use(
    session({
        name: 'session',
        // keys: ['key1', 'key2'],
        secret: process.env.COOKIE_SECRET,
        maxAge: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    })
);

/* Additional security middlware */
// app.use(csurf());
// 2/19/2024 - This threw an error so I commented it out for now.

/*******************************************
    ROUTES
 *******************************************/

// Authentication with spotify routes
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);


// Backend API Routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

/*

AUTO-FILLED BY AWS CODEWHISPERER

//*******************************************
//    ERROR HANDLING
// ******************************************

// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).send('Something broke!');
// }

*/


/*******************************************
    MAIN
 *******************************************/

// app.listen(8888, () => {
//     console.log("Server started on port 8888");
// });

// Starts server if database connection is successful.
// Otherwise, exits the process.
mongoose.connect(database_uri)
    .then(() => {
        console.log("Connected to database!");
        app.listen(8888, () => {
            console.log("Server started on port 8888");
        });
    })
    .catch((err) => {
        console.log("Connection failed!");
        console.log(err);
        process.exit(1); // Exit the process with an error code of 1 (failure)
    });



module.exports = app;



/*

    Reference materials
    - https://developer.spotify.com/documentation/web-api/tutorials/code-flow
    - https://github.com/spotify/web-api-examples/tree/master/authentication/authorization_code

*/


// Most of the material below was copied from:
// https://github.com/spotify/web-api-examples/tree/master/authentication/authorization_code

// Plain English Tutorial: https://javascript.plainenglish.io/accessing-the-spotifyalgorithm-full-stack-application-tutorial-part-1-792a2c0ff13
