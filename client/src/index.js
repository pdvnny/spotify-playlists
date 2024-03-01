import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


// NOTES FROM "How to Create a Navbar in React with Routing"
/*
 - 'BrowserRouter' is for routing in the browser
  -- React also allows you to do routing for mobile apps
 - Surround "<App />" with <BrowserRouter> because out entire application
   is going to be using this single router to manage all routing
 - You define the router and all the routes inside of it in App.js
*/
