import "../App.css";
// import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
// import { Container, InputGroup, Form } from 'react-bootstrap';
// import { Container, Button, Row, Card, Pagination} from 'react-bootstrap';

import axios from 'axios';

function Search() {

    const [trackInput, setTrackInput] = useState("");
    const [artistInput, setArtistInput] = useState("");
    const [accessToken, setAccessToken] = useState("");

    // League related objects and methods
    const [activeLeaguePlaylists, setActiveLeaguePlaylists] = useState([]);
    const [leagueIdx, setLeagueIdx] = useState(0);

    // control of elements on page
    const [isLoadingButton, setButtonLoading] = useState(false);
    const [isLeagueSelected, setLeagueSelected] = useState(false);

    const [songs, setSongs] = useState([]);
    
    // setting up pagination
    const [displaySongs, setDisplaySongs] = useState([]); // select a subset of the "songs" array 
    const [pageIdx, setPageIdx] = useState(1);
    const [pageList, setPageList] = useState([]);

    const maxPageItems = 12;


    // Get API access token for search
    useEffect(() => {
        axios.get('/auth/basic-token').then(({data}) => {
            setAccessToken(data.access_token); // store access_token in state
        })
    }, []);

    // Get active leagues from backend
    useEffect(() => {
        axios.get('/api/active-playlists').then(({data}) => {
            setActiveLeaguePlaylists(data);

            // Data seems to be an array
            // console.log("Fetched the active playlists");
            // console.log(data);
        })
    }, []);

    function artistsAsString(artists) {
        let artistsString = "";
        for (let ii = 0; ii < artists.length; ii++) {
            artistsString += artists[ii].name;
            if (ii !== artists.length - 1) {
                artistsString += ", ";
            }
        }
        return artistsString;
    }

    function artistsAsArray(artists) {
        let artistsArray = [];
        for (let ii = 0; ii < artists.length; ii++) {
            artistsArray.push(artists[ii].name);
        }
        return artistsArray;
    }

    // This method sends the song request to the MongoDB 
    // via the backend API
    async function storeSongRequest(song) {
        console.log("Storing song request");
        console.log(song);

        // Prepare the body of the request
        const body = {
            "target_playlist_id": activeLeaguePlaylists[leagueIdx].spotify_id,
            "track": song.name,
            "artists": artistsAsArray(song.artists),
            "album": song.album.name,
            "explicit": song.explicit,
            "spotify_id": song.id,
            "spotify_url": song.external_urls.spotify
        }

        // Send post request with data as the body
        let res = await axios.post('/api/new-song-request', body)
            .then((response) => {
                if (response.status === 200) {
                    console.log("Song request saved successfully");

                    // ADD CODE TO CHANGE THE APPEARANCE OF THE SCREEN
                    // e.g., clear the search form and results

                    return response.data;
                }
            })
            // .then((response) => { return response })
            .catch((err) => { console.log(err) });

        // Handle the response
        // console.log(res)

    }

    // Creating an object to add over and over to the page
    function SongCard({ songInfo }) {
        return (
            // VERSION 2 - html & react
            <div className="song-card">
                <div className="song-card-img">
                    <img src={songInfo.album.images[0].url} alt={songInfo.album.name}/>
                </div>
                <div className="song-card-info">
                    <div className="song-card-info-header">
                        <div className="song-card-info-header-artist">
                            {artistsAsString(songInfo.artists)}
                        </div>
                        <div className="song-card-info-header-album">
                            <u>Album:</u> {songInfo.album.name}
                        </div>
                    </div>
                    <div className="song-card-info-body">
                        <p>{songInfo.name}</p>
                        <button 
                            className="btn-secondary"
                            onClick={() => { storeSongRequest(songInfo) } }>
                            Select
                        </button>
                    </div>
                </div>
            </div>

            // VERSION 1 - bootstrap react
            // <Card style={{width: '20rem'}}>
            //     <Card.Img src={songInfo.album.images[0].url} />
            //     <Card.Header>{artistsAsString(songInfo.artists)}</Card.Header>
            //     <Card.Body>
            //         {/* <Card.Title>{songInfo.album.name}</Card.Title>
            //         <Card.Text>Song: {songInfo.name}</Card.Text> */}
            //         <Card.Title>Song: {songInfo.name}</Card.Title>
            //         <Button 
            //             variant="primary" 
            //             size='sm' 
            //             onClick={() => { storeSongRequest(songInfo) } }> 
            //                 Select
            //         </Button>
            //     </Card.Body>
            //     </Card>
        )
    }

    // function createPagination(totalPages) {
    //     let customPagination = [];
    //     for (let ii = 1; ii <= totalPages; ii++) {
    //         customPagination.push(ii)
    //     }
    //     return customPagination
    // }

    // Function to search Spotify via the API
    // Does not return anything but sets the "songs" state
    // to an array of the returned songs
    async function searchSpotify() {
        console.log("Searching for Track: " + trackInput + " Artist: " + artistInput);

        // NOTE: you cannot reach this point if a league is not selected

        if (trackInput === "" && artistInput === "") {
            alert("Search was canceled becasue the song and artist inputs are empty.\n" +
            "Please try entering a song and/or an artist and submit again.");
            return;
        }

        setButtonLoading(true);

        let query = "";
        if (trackInput === "") {
            query = "artist:" + artistInput;
        } else if (artistInput === "") {
            query = "track:" + trackInput;
        } else {
            query = "track:"+ trackInput + " artist:" + artistInput
        }

        // Get the first 100 song matches for the search parameters
        const searchParams = {
            q: query,
            type: 'track',
            market: 'US',
            limit: 50
        }
        const header = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken,
        }

        const endpoint = 'https://api.spotify.com/v1/search?'
        const queryParams = new URLSearchParams(searchParams).toString();

        // console.log(endpoint + queryParams);

        const returnedSongs = await fetch(
                                    endpoint + queryParams, 
                                    {method: 'GET', headers: header}
                                  ).then((res) => res.json())
                                  .then((data) => {
                                    // console.log(data);
                                    // console.log(data.tracks.items);
                                    setSongs(data.tracks.items);
                                    setDisplaySongs(data.tracks.items.slice(0, maxPageItems));
                                    return data.tracks.items;
                                });
        // console.log(returnedSongs);
        // if (I return data.tracks.items)  ==>  returnedSongs has all songs
        // else (no return)                 ==>  returnedSongs is undefined

        /*
        {tracks : {
           tracks: {
               href: ,
               items: Array of objects
                       album - object,
                            NOTE: album.images[i].url gives the url of the album art
                       artists - array, 
                       disc_number - int, 
                       duration_ms - int (seconds), 
                       explicit - bool, 
                       external_ids - objects, 
                       external_urls - object -> {spotify: the spotify url}, 
                       href - string, same as spotify url, 
                       id - string, 
                       is_local - bool, 
                       is_playable - bool, 
                       name - string; name of the song,
                       popularity - int (no idea what this is),
                       preview_url - string, 
                       track_number - int, 
                       type - string; should be "track", 
                       uri - string; a identifying object for Spotify it seems
           }
        }}
        */

        // console.log(songs);  
        // This doesn't seem to work until after this function finishes




        // Creation pagination now that we know how many pages there will be
        // setNumPages(Math.ceil(songs.length / maxPageItems));
        let numPages = Math.ceil(returnedSongs.length / maxPageItems);

        let pagesAsList = [];
        for (let ii = 1; ii <= numPages; ii++) {
            pagesAsList.push(ii);
        }
        // console.log(pagesAsList);
        setPageList(pagesAsList);

        // // Display the the responses to the user
        // console.log("Number of songs returned: " + returnedSongs.tracks.items.length + " songs");
        // for (let i = 0; i < returnedSongs.tracks.items.length; i++) {
        //     const songInfo = returnedSongs.tracks.items[i];
        //     cards.push(<SongCard songInfo={songInfo} />);
        // }


        setButtonLoading(false);
    }

    // This works just fine
    // console.log(songs);


    return (
        <div className="App">
            <header className='App-header'>
                <h1>Search</h1>
            </header>
            <div className='App-body'>

                {/* <h2>Enter league and song information</h2> */}
                
                <div className="form-container">
                    <form id="search-form" className='dark-input'>

                        <label className="super-label" htmlFor="leagueSelection">Select your league</label>
                        <div id='leagueSelection' className="input-group-selection">
                            <select 
                                name="leagueSelection"
                                onChange = {(event) => {
                                    if (event.target.value === '-1') {
                                        setLeagueSelected(false);
                                    } else {
                                        setLeagueIdx(parseInt(event.target.value));
                                        setLeagueSelected(true);
                                    }
                                }}
                            >
                                <option value="-1">Choose a league</option>
                                {activeLeaguePlaylists.map((playlist, idx) => {
                                            return <option key={idx} value={idx}>{playlist.name}</option>
                                })}
                            </select>
                        </div>

                        <label className="super-label" htmlFor='query-inputs'>Enter your search parameters</label>
                        <div className="input-group-text" id='query-inputs'>
                            <label className="sub-label" htmlFor="song">Song</label>
                            <input 
                                type="text" 
                                name="song" 
                                id="song" 
                                placeholder="Enter a song"
                                onChange = {(event) => {
                                    setTrackInput(event.target.value)
                                }}
                            />
                            <label className="sub-label" htmlFor="artist">Artist</label>
                            <input 
                                type="text" 
                                name="artist" 
                                id="artist" 
                                placeholder="Enter an artist"
                                onChange = {(event) => {
                                    setArtistInput(event.target.value)
                                }}
                            />
                        </div>
                        <button
                            className="btn-primary"
                            type="submit"
                            variant='primary' 
                            disabled={isLoadingButton || !isLeagueSelected}
                            onClick={!isLoadingButton && isLeagueSelected ? searchSpotify : null}                                
                        >
                            Submit Search
                        </button>

                    </form>
                </div>

                {/* <Container>
                    <InputGroup className='mb-3' size='lg'>
                        <Form type='submit'>
                            <Form.Group className='mb-3' controlId="searchForm.LeagueSelect">
                                <Form.Label>Select your league</Form.Label>
                                <Form.Select onChange={(event) => {
                                        if (event.target.value === '-1') {
                                            setLeagueSelected(false);
                                        } else {
                                            setLeagueIdx(parseInt(event.target.value));
                                            setLeagueSelected(true);
                                        }
                                    }}>
                                    <option value="-1">Select Your League</option>
                                    {activeLeaguePlaylists.map((playlist, idx) => {
                                        return <option key={idx} value={idx}>{playlist.name}</option>
                                    })}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className='mb-3' controlId="searchForm.ControlInput1">
                                <Form.Label>Enter Spotify search parameters</Form.Label>
                                <Form.Control
                                    type="text" 
                                    placeholder="Song" 
                                    onChange={(event) => {
                                        setTrackInput(event.target.value)
                                    }}
                                />
                                <Form.Control
                                    type="text"
                                    placeholder="Artist"
                                    onChange={(event) => {
                                        setArtistInput(event.target.value)
                                    }}
                                />
                            </Form.Group>
                            <Button 
                                type='submit' 
                                variant='primary' 
                                disabled={isLoadingButton || !isLeagueSelected}
                                onClick={!isLoadingButton && isLeagueSelected ? searchSpotify : null}>
                                Submit Search
                            </Button>
                        </Form>
                    </InputGroup>
                </Container> */}

                <h2>Search Results</h2>
                <div className="cards">
                    {displaySongs.map( (song, idx) => {
                                return <SongCard songInfo={song} key={idx}/>
                    })}
                </div>
                <div className="pagination-container">
                    {
                        pageList.map( (page, idx) => {
                            return (
                                <button
                                    class={page === pageIdx ? "active" : "inactive"}
                                    onClick={() => {
                                        setPageIdx(page)
                                        setDisplaySongs(songs.slice((page-1)*maxPageItems, page*maxPageItems))
                                    }}
                                >
                                        {page}
                                </button>
                            )
                        })
                    }
                </div>

                {/* <Container>
                    <Row className='mx-2 row row-cols-3'>
                        {displaySongs.map( (song, idx) => {
                                return <SongCard songInfo={song} key={idx}/>
                        })}
                    </Row>
                    <br/>
                    <Pagination size="lg">
                        {pageList.map( (page, idx) => {
                            return (
                            <Pagination.Item 
                                key={page} 
                                active={page === pageIdx} 
                                onClick={() => {
                                    setPageIdx(page)
                                    setDisplaySongs(songs.slice((page-1)*maxPageItems, page*maxPageItems))
                                    }}
                            >
                                {page}
                            </Pagination.Item>)
                        })}
                    </Pagination>
                </Container> */}
            </div>
        </div>
    )
}

export default Search;
