// routes/api.js

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const Playlist = require('../models/playlist.model');
const SongRequest = require('../models/songrequest.model');

/* Database configuration */
const database_uri = "mongodb+srv://pdunn91:kb2uu9z0hBluJvhf@volo-play-dev.hsbm6cs.mongodb.net/?retryWrites=true&w=majority";


/************************* PLAYLISTS ***************************/

router.post(
    '/create-playlist',
    async (req, res, next) => {
        try {
            const newPlaylist = await Playlist.create(req.body);
            res.status(200).json(newPlaylist);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
);

router.get(
    '/get-playlists',
    async (req, res, next) => {
        try {
            const playlists = await Playlist.find();
            res.status(200).json(playlists);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
);

router.get(
    '/active-playlists',
    async (req, res, next) => {
        try {
            const playlists = await Playlist.find({ active: true });
            res.status(200).json(playlists);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
)

router.post(
    '/update-playlist',
    async (req, res, next) => {
        try {
            const filter = { _id: req.body._id };
            const newPlaylist = await Playlist.findOneAndUpdate(filter, req.body, { new: true });
            console.log("From '/api/update-playlist': ", newPlaylist);
            res.status(200).json(newPlaylist);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
)

/************************* SONG REQUESTS ***************************/

router.post(
    '/new-song-request',
    async (req, res, next) => {
        try {
            const newSongRequest = await SongRequest.create(req.body);
            res.status(200).json(newSongRequest);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
);

router.get(
    "/song-requests",
    async (req, res, next) => {
        try {
            const songRequests = await SongRequest.find();
            res.status(200).json(songRequests);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
)

router.post(
    "/remove-song-request",
    async (req, res, next) => {
        try {
            // console.log(req.body);
            const songRequestId = { _id: req.body.id };
            // console.log(songRequestId);
            const deletedCount = await SongRequest.findByIdAndDelete(songRequestId);
            console.log(deletedCount);
            res.status(200).json(deletedCount);
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: err.message });
        }
    }
)




module.exports = router;

// IMPLEMENTING ROUTES RELATED TO MY BACKEND API
// (which I expect only be used by me)

/* ------ IDEAS ------

    Database
    - Endpoints to store/fetch playlist related information
        - e.g., create a new playlist record
    - Endpoints to store/fetch song related information
        - e.g., current songs in a playlist
        - e.g., new song addition requests

    Interacting with Spotify API
    - Create a new playlist (then send the information to the database)
    - Add new song to a playlist

*/

/*
    Template code for a try-catch block at a POST endpoint

    ```
    try {
        const product = await Product.create(req.body);
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
    ```
*/
