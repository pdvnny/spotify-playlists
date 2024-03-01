// import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import '../App.css';

// import { Link } from 'react-router-dom';

import { useState, useEffect } from 'react';
import axios from 'axios';

// import Tabs from '../components/Tabs';
import CreatePlaylist from '../components/CreatePlaylist';
import UpdatePlaylists from '../components/UpdatePlaylists';
import DeletePlaylist from '../components/DeletePlaylist';
import ViewPlaylists from '../components/ViewPlaylists';

function Manage() {

    // ACCOUNT RELATED INFOMATION
    const [username, setUsername] = useState("");
    const [authAccessToken, setAuthAccessToken] = useState("");
    const [authRefreshToken, setAuthRefreshToken] = useState("");

    // CONTROL WHICH TAB IS BEING SHOWN
    const [currentTab, setCurrentTab] = useState("1");

    // PLAYLIST RELATED INFORMATION
    // const [playlists, setPlaylists] = useState([]);

    // SONG RELATED INFORMATION
    // const [requestedSongs, setRequestedSongs] = useState([]);

    // FETCH LOGIN INFORMATION
    useEffect(() => {
        axios.get('/auth/current-session').then(({data}) => {
            // console.log("Retrieved session data: ", data);
            if (data) {
                setAuthAccessToken(data.access_token); // store access_token in state
                setAuthRefreshToken(data.refresh_token); // store refresh_token in state

                axios.get("https://api.spotify.com/v1/me", {
                    headers: {
                        Authorization: `Bearer ${data.access_token}`
                    }
                }).then(({data}) => {
                    let name = data.display_name ? data.display_name : data.email;
                    console.log("Username (in useEffect): ", name);
                    setUsername(name);
                });
            }
        })
    }, []);

    function LoginInfo() {
        // console.log("Creating login - accToken value: ", accToken);
        if (username === "" || !username) {
            return (
                <p>You are not logged in:
                        <a className="App-link" href="/auth/login"><em>Login to Spotify</em></a>
                </p>
            )          
        } else {
            return (
                <p>Welcome, {username} 
                    <a className="App-link" href="/auth/logout">(<em>Logout</em>)</a>
                </p>
            )
        }
    }

    // console.log("Access token: ", authAccessToken);
    // console.log("Username: ", username); // Undefined ... which is expected

    function TabContent(active) {
        console.log("TabContent - active: ", active);
        if (active === "1") {
            return <CreatePlaylist authToken={authAccessToken} username={username} />
        } else if (active === "2") {
            return <UpdatePlaylists authToken={authAccessToken} username={username} />
        } else if (active === "3") {
            return <DeletePlaylist />
        } else if (active === "4") {
            return <ViewPlaylists />
        }
    }

    // console.log(currentTab);

    return (
        <div className="App">
            <header className='App-header'>
                <h1>Playist Management Portal</h1>
            </header>
            <div className='App-body'>
                <div className='login'>
                    {/* Need to setup a JSX block here that is filled
                    by a function that checks if the user is logged in */}
                    {LoginInfo()}
                </div>
                
                <div className="tabs-container">
                
                    <div className='tabs-nav'>
                        <button 
                            className={currentTab === "1" ? "active" : "inactive"}
                            onClick={() => {setCurrentTab("1")}}
                            >Create Playlist</button>
                        <button 
                            className={currentTab === "2" ? "active" : "inactive"}
                            onClick={() => {setCurrentTab("2")}}
                            >Update Playlists</button>
                        <button 
                            className={currentTab === "3" ? "active" : "inactive"}
                            onClick={() => {setCurrentTab("3")}}
                            >Delete Playlist</button>
                        <button 
                            className={currentTab === "4" ? "active" : "inactive"}
                            onClick={() => {setCurrentTab("4")}}
                            >View Playlists</button>
                    </div>

                    {TabContent(currentTab)}
                    {/* <div className="tabs-content">
                        <p>Temporary</p>
                    </div> */}
        
                    
                </div>
            </div>
        </div>
    );
}

/* FUNCTIONALITY NEEDED

    - (1) ability to login to Spotify
    - (2) create a new playlist & store the playlist info in the database
    - (3) updating playlists
        - just needs to pull all of the songs in the request queue
        - Then, send add requests to the playlists
    - (4) deleting a playlist

*/

export default Manage;