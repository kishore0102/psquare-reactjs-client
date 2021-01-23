import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import "./App.css";
import Nav from "./components/nav.component";
import Notes from "./components/notes.component";
import Login from "./components/login.component";
import Register from "./components/register.component";
import Newnote from "./components/newnote.component";
import UpdateNote from "./components/updatenote.component";
import Home from "./components/home.component";

export default class App extends Component {

    state = {
        user: {}
    };

    componentDidMount = () => {
        this.setState({
            user: localStorage.getItem("token") ?
                JSON.parse(window.atob(localStorage.getItem("token").split('.')[1])) : {}
        })
    }

    render() {
        return (
            <BrowserRouter>
                <div className="App">
                    <Nav user={this.state.user} />
                    <Switch>
                        <Route exact path="/home" component={() => <Home user={this.state.user} />} />
                        <Route exact path="/" component={() => <Notes user={this.state.user} />} />
                        <Route exact path="/login" component={() => <Login />} />
                        <Route exact path="/register" component={() => <Register />} />
                        <Route exact path="/newnote" component={() => <Newnote />} />
                        <Route exact path="/updatenote" render={(props) => <UpdateNote {...props} />} />
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}
