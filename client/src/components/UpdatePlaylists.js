import React from 'react';
import '../App.css';
import { useState, useEffect } from 'react';

import axios from 'axios';

function UpdatePlaylists({ authToken, username }) {
    
    const [dbPlaylists, setDbPlaylists] = useState([]);
    const [songRequests, setSongRequests] = useState([]);

    // const [playlistUpdated, setPlaylistUpdated] = useState([]);
    
    const [dispOutput, setDispOutput] = useState("");
    const [playlistsFetched, setPlaylistsFetched] = useState(null);
    const [songRequestsFetched, setSongRequestsFetched] = useState(null);

    // const [playlistUpdateErrors, setPlaylistUpdatedErrors] = useState([]);

    /*
    async function getActivePlaylists() {
        let addToConsole = "Fetching the active playlists.\n";

        await axios.get("/api/active-playlists")
            .then((response) => {
                addToConsole += "Fetched active playlists successfully!\n";
                setDbPlaylists(response.data);
            }).catch((error) => {
                addToConsole += "Playlist creation failed!\n";
                console.log("ERROR!\n", error);
            })
    }
    */

    /*
    async function getSongRequests() {
        let addToConsole = "Fetching the song requests.\n";

        await axios.get("/api/song-requests")
            .then((response) => {
                addToConsole += "Fetched song requests successfully!\n";
                setSongRequests(response.data);
            }).catch((error) => {
                addToConsole += "Failed to fetch song requests!\n";
                console.log("ERROR!\n", error);
            })
    }
    */

    /*
    This method will iterate through the "songRequests" and add them to the playlist
    if it is active.

    How it functions...
    - Iterate through the playlists
        -> filter for song requests for the playlist
        -> For each song - send Spotify request, check status
            > Success - add ID to list of records for deletion
            > Failure - ????? (Add to a failure list?)
    - Check the leftover songs
        -> If the playlist is inactive, delete the request
        -> Else???
    */
    async function addRequestedSongs() {
        let consoleInfo = "";
        let idSongsAdded = [];
        let playlistsUpdated = [];

        // *****************************************************
        // ADDING SONG REQUESTS TO PLAYLISTS
        // *****************************************************
        for (let i = 0; i < dbPlaylists.length; i++) {
            let playlist = dbPlaylists[i];

            let songRequestsForPlaylist = songRequests.filter((songRequest) => songRequest.target_playlist_id === playlist.spotify_id);
            
            // debugging
            // console.log(`Song Requests for : ${playlist.name}`)

            // setup for Spotify API
            const endpoint = `https://api.spotify.com/v1/playlists/${playlist.spotify_id}/tracks`
            const header = {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "application/json"
                }
            }

            let uris = [];
            let dbIds = [];
            for (let j = 0; j < songRequestsForPlaylist.length; j++) {
                let songRequest = songRequestsForPlaylist[j];

                // debugging
                // console.log(`(${j+1}) "${songRequest.track}" by ${songRequest.artists.join(", ")}`);

                let songUri = `spotify:track:${songRequest.spotify_id}`;
                uris.push(songUri);
                dbIds.push(songRequest._id);
            }

            // debugging
            // console.log(uris);

            if (uris.length > 0) {
                let success = await axios.post(endpoint, { uris: uris }, header)
                    .then((response) => {
                        // console.log('Status: ', response.status);

                        if (response.status === 201) {
                            return true;
                        } else {
                            return false;
                        }
                    }).catch((error) => {
                        if (error.response.status === 400) {
                            alert("You are probably not logged in.");
                        } else if (error.response.status === 401) {
                            alert("There is a problem with the access token.")
                        }
                        console.log("ERROR!\n");
                        console.log("Code: ", error.code);
                        console.log("Message: ", error.message);
                    })

                // let success = true;
                // console.log("Updating this playlist: ", playlist);
                
                if (success) {
                    consoleInfo += `Added ${uris.length} songs to ${playlist.name}\n`;
                    idSongsAdded.push(...dbIds);
                    playlist.most_recent_update = Date.now();
                    playlistsUpdated.push(playlist);
                }
            } else {
                consoleInfo += `No songs to add to ${playlist.name}\n`;
            }
        }

        
        // *****************************************************
        // UPDATING THE DATABASE - removing requests and updating playlists
        // *****************************************************
        // console.log("Updated Playlists: ", playlistsUpdated);
        // console.log("IDs of songs added: ", idSongsAdded);

        // Updated the playlists in the database
        for (let i = 0; i < playlistsUpdated.length; i++) {
            let newPlaylistInfo = playlistsUpdated[i];
            // console.log("Updating playlist: ", newPlaylistInfo);
            let playlistUpdateInfo = await axios.post("/api/update-playlist", newPlaylistInfo)
                .then((response) => {
                    if (response.status === 200) {
                        console.log("Playlist update success: ", response.data.name);
                        return "Playlist updated successfully!\n";
                    } else {
                        console.log("Playlist update fail: ", response.data.name)
                        return "Playlist update failed!\n";
                    }                    
                })
                .catch((error) => {
                    console.log(error)
                    // console.log("Code: ", error.code);
                    // console.log("Message: ", error.message);
                    return "Playlist update failed!\n";
                });
            consoleInfo += playlistUpdateInfo;
        }

        // Removed the song requests from the database
        for (let i = 0; i < idSongsAdded.length; i++) {
            let idSongRequest = {id: idSongsAdded[i]};
            console.log("Removing song with ID: ", idSongRequest);
            await axios.post("/api/remove-song-request", idSongRequest)
                .then((response) => {
                    if (response.status === 200) {
                        console.log("Song request removed: ", response.data.track);
                    } else {
                        console.log("Song request remove failed: ", response.data.track)
                    }
                })
                .catch((error) => {
                    console.log("Code: ", error.code);
                    console.log("Message: ", error.message);
                });
        }

        setDispOutput(consoleInfo);
    }

    function generateUpdates(additionalUpdates) {
        let updates = "";

        // Retreiving information from database
        if (playlistsFetched === null)
            updates += "Playlists are still being fetched...\n";
        else
            updates += (playlistsFetched ? "Playlists fetched successfully!\n" : "Playlists failed to fetch!\n");
        if (songRequestsFetched === null)
            updates += "Song requests are still being fetched...\n";
        else
            updates += (songRequestsFetched ? "Song requests fetched successfully!\n" : "Song requests failed to fetch!\n");
        
        // Displaying info about the process of adding songs to playlists
        // for ()

        return updates + additionalUpdates;
    }

    // Fetch the active playlists and the full database of song requests
    useEffect(() => {
        // GET ACTIVE PLAYLISTS
        axios.get("/api/active-playlists")
            .then((response) => {
                setPlaylistsFetched(true);
                setDbPlaylists(response.data);
            }).catch((error) => {
                setPlaylistsFetched(false);
                console.log("ERROR!\n", error);
            });
        
        // GET SONG REQUESTS
        axios.get("/api/song-requests")
            .then((response) => {
                setSongRequestsFetched(true);
                setSongRequests(response.data);
            }).catch((error) => {
                setSongRequestsFetched(false);
                console.log("ERROR!\n", error);
            })
    }, []);


    return (
        <div className="tabs-content">
            <h2>Update playlists</h2>

            <div>
                {/* <p>Update a playlist by adding songs to it.</p> */}
                
                <button
                    type=""
                    className="btn-primary"
                    onClick={() => {
                        // debugging
                        // console.log("Playlists:", dbPlaylists);
                        // console.log("Song Requests:", songRequests);

                        addRequestedSongs();
                    }}
                >Update playlists</button>
            </div>

            <div className="printout">
                <h2>Updates</h2>
                <pre id="output-p">{generateUpdates(dispOutput)}</pre>
            </div>
        </div>
    )
}

/*
    FUNCTIONALITY NEEDED!

    - Load all of the song requests in the database currently
    - Send "add song" requests to Spotify API
    - Empty the song requests in the database (and the end of adding songs??)
        - I can probably just save the "_id" of the records added successfully
          and run a bunch of deletes at the end

    OBJECTS NEEDED

    - A map/object to track each playlist's last update
    - A map/object to track if a playlist has been updated

*/

export default UpdatePlaylists;
