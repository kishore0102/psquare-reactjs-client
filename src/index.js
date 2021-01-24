import axios from "axios";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

const dotenv = require('dotenv').config();
console.log("dotenv - ", dotenv);
console.log("NODE_ENV : " + process.env.NODE_ENV);
console.log("API_URL : " + process.env.API_URL);
console.log("REACT_APP_PSQUARE_API_URL : " + process.env.REACT_APP_PSQUARE_API_URL);

axios.defaults.baseURL = process.env.PSQUARE_API_URL;
axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById("root")
);
