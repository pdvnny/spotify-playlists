const mongoose = require('mongoose');

// First attempt to create a playlist model
const playlistSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "The playlist name is required"]
        },
        // Addressed by "timestamps: true" below!
        // creation: {
        //     type: Date,
        //     required: [true, "The playlist creation date is required"],
        //     default: Date.now
        // },
        most_recent_update: {
            type: Date,   // def needs to be date & time though
            required: [true, "The date of the most recent update of this playlist is required"],
            default: Date.now
        },
        spotify_url: {
            type: String,
            required: [true, "The Spotify URL of the playlist is required"]
        },
        spotify_uri: {
            type: String,
            required: [true, "The Spotify URI of the playlist is required"]
        },
        spotify_id: {
            type: String,
            required: [true, "The Spotify ID of the playlist is required"]
        },
        league_start: {
            type: Date,
            required: [true, "The league start date is required"]
        },
        league_end: {
            type: Date,
            required: [true, "The league end date is required"]
        },
        active: {
            type: Boolean,
            required: [true, "The playlist active status is required"],
            default: true
        }
    },
    {
        timestamps: true,  
        // this automatically creates 2 additional fields 
        // (1) Created at
        // (2) Updated at
    }
);

// Allow MongoDB to use the schema above!
const Playlist = mongoose.model('Playlist', playlistSchema);
// *** WARNING ***
// "Playlist" above should be singular
// The MongoDB database automatically makes the name plural


// Most of these items are returned when a playlist is created
// making it easy to keep consistent & accurate records from 
// the  moment of playlist creation
// - name (via ReturnObject.name)
// - spotify_url (via ReturnObject.external_urls.spotify)
// - spotify_uri (via ReturnObject.uri)
// - spotify_id (via ReturnObject.id)

// NOTE: This link suggests how to work with dates!
// https://mongoosejs.com/docs/guide.html

module.exports = Playlist;
