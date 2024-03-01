// backend/controllers/playlists.js

// Scripts for managing playlists
// - Creating a new playlist
// - Deleting a playlist
// - Archiving a playlist
// - Updating the contents of a current playlist
//      - Adding new songs to a playlist

const mongoose = require('mongoose');
const Playlist = require('../models/playlist');




// BELOW IS JUST SOMETHING TO REFERENCE

// Create a new playlist
exports.create = (req, res) => {
  const { name } = req.body;
  const playlist = new Playlist({ name });
  playlist.save()
    .then(savedPlaylist => res.json(savedPlaylist))
    .catch(err => res.status(400).json(err));
}

