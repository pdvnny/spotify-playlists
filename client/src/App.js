// import logo from './logo.svg';
import './App.css';
// import 'bootstrap/dist/css/bootstrap.min.css';

// import React, {useState, useEffect} from 'react';
// import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';

// import axios from 'axios';

/* Import other pages */
import Home from './pages/Home';
// import Loading from './pages/Loading';
import Manage from './pages/Manage';
import Search from './pages/Search';

import MyNavBar from './components/navbar';
import Container from 'react-bootstrap/Container';


function App() {

  // VERSION 3 - react router code
  return (
    <>
      <MyNavBar/>
      <Container className="page-container">
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/search" element={<Search/>}/>
          <Route path="/manage" element={<Manage/>}/>
          {/* <Route path="*" element={<Loading/>}/> */}
        </Routes>
      </Container>
    </>
  ) 


  // VERSION 2 - inefficient b/c it reloads the application each time you navigate
  // and it's not scalable because of the switch statement
  // let component
  // switch (window.location.pathname) {
  //   case '/search':
  //     component = <Search/>
  //     break;
  //   case '/manage':
  //     component = <Manage/>
  //     break;
  //   case '/':
  //     component = <Home/>
  //     break;
  //   default:
  //     component = <Loading/>
  // }

  // return (
  //   <>
  //     <MyNavBar/>
  //     {component}
  //   </>
  // )

  // VERSION 1
  // if (acctAuth == null) {
  //   return <Loading/>
  // }
  // if (acctAuth === false) {
  //   return <Search/>
  // }
  // // return <Home/>
  // return <Home/>
}

export default App;


