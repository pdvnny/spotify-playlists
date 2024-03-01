// routes/league.js

// IMPLEMENTING ROUTES FOR GETTING AND RETRIEVING
// LEAGUE INFORMATION FOR THE USER

const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');


const router = express.Router();

// MAYBE THIS WORKS, BUT I DON'T THINK IT'S THE RIGHT USE
// OF THE SESSION
// router.get(
//     '/select',
//     (req, res, next) => {
//         console.log("Setting league selection by user.");
//         const leagueChoice = {
//             leagueName: req.query.league,
//             leagueId: req.query.id
//         };
//         req.session.league = jwt.sign(leagueChoice, process.env.JWT_SECRET);
//         console.log(`League: ${req.query.league}\nID: ${req.query.id}`);
//         return res.redirect("/");
//     }
// );

// router.get(
//     '/current-league',
//     (req, res, next) => {
//         console.log("Retrieving current league selection.");
//         if (req.session.league) {
//             return res.send(req.session.league);
//         } else {
//             return res.send(false);
//         }
//     }
// );
