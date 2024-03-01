import "../App.css";
// import 'bootstrap/dist/css/bootstrap.min.css';

// import Container from 'react-bootstrap/Container';
// import Row from 'react-bootstrap/Row';
// import Col from "react-bootstrap/Col";

// import { useState } from 'react';

import { Link } from "react-router-dom";

function Home() {

    return (
        <div className="App">
            <header className="App-header">
                <h1>Homepage</h1>
            </header>
            <div className="App-body">
                <h2>To add a song to a playlist, tap on the button below!</h2>
                <div className="btn-block">
                    <Link to="/search">
                        Search
                    </Link>
                </div>
                <p>(You can also use the "Search" tab at the top of the screen to navigate there.)</p>
            </div>
        </div>
    )
}

export default Home;

// How do I set up this page to allow a user to select their league and
// save that data at an endpoint?

// My idea
// - Create an endpoint to register the information for retreival in App()
// - Convert this document to a form that sends the league info to /league/select
//   so that the data can be saved and retrieved
// - Once data is registered about the league, then App() can route the user
//   correctly
