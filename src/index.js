import axios from "axios";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";


console.log("env api url - " + $API_URL);
axios.defaults.baseURL = process.env.API_URL;
axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById("root")
);
