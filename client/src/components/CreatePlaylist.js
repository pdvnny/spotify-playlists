import React from 'react';
import '../App.css';
import { useState } from 'react';

import axios from 'axios';


function CreatePlaylist({ authToken, username }) {
    // AUTH RELATED DATA

    // TRACK INPUT DATA
    const [playlistName, setPlaylistName] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // DISPLAY STATUS INFORMATION
    const [consoleOutput, setConsoleOutput] = useState("Pending");

    async function createSpotifyPlaylist(playlistName, startDate, endDate) {
        let addToConsole = "Creating playlist: " + playlistName;
        addToConsole += "\nStart date: " + startDate;
        addToConsole += "\nEnd date: " + endDate + "\n\n";

        // Create the new playlist
        const endpoint = `https://api.spotify.com/v1/users/${username}/playlists`;
        const playlistData = {
            "name": playlistName,
            "public": true
        };
        const header = {
            headers: {
                "Authorization": `Bearer ${authToken}`,
                "Content-Type": "application/json"
            }
        }
        let spotifyResponse = await axios.post(endpoint, playlistData, header)
            .then((response) => {
                addToConsole += "Playlist created successfully\n";
                return response;
            }).catch((error) => {
                console.log("ERROR!\n", error);
                addToConsole += "Playlist creation failed!\n";
            })

        // Debugging
        // console.log(data); 
        // produces an object with name, external_urls.spotify, href, id, uri
        console.log(spotifyResponse);
        
        // Save the playlist information in the database if successful
        let data = spotifyResponse.data;
        if (spotifyResponse.status === 201) {
            // prepare database record
            let playlistRecord = {
                name: data.name,
                spotify_url: data.external_urls.spotify,
                spotify_uri: data.uri,
                spotify_id: data.id,
                league_start: startDate,
                league_end: endDate
            }

            // request to backend to save the playlist data
            await axios.post("/api/create-playlist", playlistRecord)
                .then((response) => {
                    addToConsole += "Playlist saved successfully\n\n";
                    // console.log(response.data);
                    let stringData = JSON.stringify(response.data).replaceAll(",", ",\n")
                    addToConsole += "Playlist record in database: \n\n" + stringData;
                }).catch((error) => {
                    console.log("ERROR!\n", error);
                    addToConsole += "Playlist saving failed!\n";
                });
        }

        // const returnObj = {
        //     "console": addToConsole,
        //     "data": "Temp Data"
        // };
        // console.log(returnObj);

        setConsoleOutput(addToConsole);
    }

    return (
        <div className="tabs-content">
            <h2>Create a new playlist</h2>
            <div>
                <form className="dark-input-2">
                    <div className='input-group-text-2'>
                        <label className='sub-label'>League Name</label>
                        <input 
                            type="text" 
                            placeholder="The league name that will be presented to the players"
                            onChange={(event) => {setPlaylistName(event.target.value)}}
                        />
                    </div>

                    <div className="input-group-dates-1">
                        <label className='sub-label'>Start Date</label>
                        <input 
                            type="date"
                            onChange={(event) => {setStartDate(event.target.value)}}
                        />
                    </div>
                    <div className="input-group-dates-1">
                        <label className='sub-label'>End Date (including playoffs)</label>
                        <input 
                            type="date"
                            onChange={(event) => {setEndDate(event.target.value)}}/>
                    </div>

                    <button 
                        type="submit" 
                        className="btn-primary"
                        onClick={(event) => {
                            event.preventDefault();
                            createSpotifyPlaylist(playlistName, startDate, endDate)
                            // console.log(console);
                        }}
                    >Create Playlist</button>

                </form>
            </div>

            <div className="printout">
                <h2>Playlist creation results</h2>
                <pre id="output-p">{consoleOutput}</pre>
            </div>

        </div>
    )
}

/*
    CONTENT NEEDED

    - Fields to enter...
     (1) Name of the playlist - i.e., the "league name"; this shows up on the "Search" page
     (2) Start of the league
     (3) End of the league (including playoffs)
*/

export default CreatePlaylist;