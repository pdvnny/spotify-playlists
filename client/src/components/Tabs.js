// FRONTEND COMPONENT: src/components/Tabs.js

import React from 'react';
import '../App.css';

import { Link, useMatch, useResolvedPath } from 'react-router-dom';


function Tabs({activeTab, onChangeCallback, children, ...props}) {

    // console.log(activeTab);
    
    return (
        <div className="tabs-container">
            
            <div className='tabs-nav'>
                {/* <nav>
                    <ul>
                        <li className={activeTab === "1" ? "active" : "inactive"}>Create Playlist</li>
                        <li className={activeTab === "2" ? "active" : "inactive"}>Update Playlists</li>
                        <li className={activeTab === "3" ? "active" : "inactive"}>Delete Playlist</li>
                        <li className={activeTab === "4" ? "active" : "inactive"}>View Playlists</li>
                    </ul>
                </nav> */}
                <button 
                    className={activeTab === "1" ? "active" : "inactive"}
                    onClick={onChangeCallback("1")}
                    >Create Playlist</button>
                <button 
                    className={activeTab === "2" ? "active" : "inactive"}
                    onClick={onChangeCallback("2")}
                    >Update Playlists</button>
                <button 
                    className={activeTab === "3" ? "active" : "inactive"}
                    onClick={onChangeCallback("3")}
                    >Delete Playlist</button>
                <button 
                    className={activeTab === "4" ? "active" : "inactive"}
                    onClick={onChangeCallback("4")}
                    >View Playlists</button>
            </div>

            
            {children}
            
        </div>
    )
}

export default Tabs;
