import axios from "axios";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
const dotenv = require('dotenv');
dotenv.config();

console.log("node_env : " + process.env.NODE_ENV);
console.log("api url : " + process.env.API_URL);
axios.defaults.baseURL = process.env.API_URL;
axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById("root")
);
