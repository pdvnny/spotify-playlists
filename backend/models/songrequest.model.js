const mongoose = require('mongoose');

const songRequestSchema = new mongoose.Schema(
    {
        target_playlist_id: {
            type: String,
            required: [true, "A target playlist ID is required for each song request submission."]
        },
        track: {
            type: String,
            required: [true, "The name of the song requested must be provided"]
        },
        artists: {
            type: Array,
            required: [true, "The name of all artists listed on the song is required"]
        },
        album: {
            type: String,
            required: [true, "The name of the album the song is from is required"]
        },
        timestamp: { 
            type: Date,
            required: [true, "A date and time are required for each song request submission."],
            default: Date.now
        },
        explicit: {
            type: Boolean,
            required: [true, "The explicit status of the song requested must be reported"]
        },
        spotify_id: {
            type: String,
            required: [true, "A Spotify ID for the song is required for each song request submission."]
        },
        spotify_url: {
            type: String,
            required: [true, "A link to the song on Spotifyis required for each song request submission."]
        }
    },
    { timestamps: true }
);

const SongRequest = mongoose.model('SongRequest', songRequestSchema);

module.exports = SongRequest;
