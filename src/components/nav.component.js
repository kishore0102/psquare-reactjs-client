import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';

export default class Nav extends Component {

	handleLogout = () => {
		localStorage.clear();
		window.location.replace("/");
	}

	handleSettings = () => {
		console.log("settings clicked");
	}

	render() {
		let buttons;
		if (localStorage.getItem("token")) {
			buttons = (
				<React.Fragment>
					<Dropdown>
						<Dropdown.Toggle variant="link" id="dropdown-basic">
							{this.props.user.firstname + " " + this.props.user.lastname}
						</Dropdown.Toggle>

						<Dropdown.Menu>
							<Dropdown.Item to={'/'} onClick={this.handleSettings} className="nav-link text-black">Settings</Dropdown.Item>
							<Dropdown.Item to={'/'} onClick={this.handleLogout} className="nav-link text-black">Logout</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
				</React.Fragment>
			);
		} else {
			buttons = (
				<React.Fragment>
					<li className="nav-item">
						<Link to={'/login'} className="nav-link text-black">Login</Link>
					</li>
					<li className="nav-item">
						<Link to={'/register'} className="nav-link text-black">Register</Link>
					</li>
				</React.Fragment>
			);
		}

		return (
			<nav className="navbar navbar-expand-md navbar-light bg-light py-3">
				<div className="container">
					<Link to={'/'} className="navbar-brand">
						Psquare
            </Link>
					<div className="collapse navbar-collapse show">
						<ul className="navbar-nav ml-auto">
							{buttons}
						</ul>
					</div>
				</div>
			</nav>
		);
	}

}