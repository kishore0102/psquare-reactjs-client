import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

export default class Home extends Component {

	render() {
		if (!localStorage.getItem("token")) {
			return <Redirect to={"/login"} />;
		}

		return (
			<React.Fragment>
				<div className="notes-card d-flex justify-content-between">
					<div className="d-flex flex-row">
						<h4>Hello {this.props.user.firstname}!</h4>
					</div>
				</div>

				<a href="/notes" className="card" style={{ "width": "18rem" }}>
					<div className="card-body">
						<h5 className="card-title">Notes</h5>
					</div>
				</a>
				<a href="/notes" className="card" style={{ "width": "18rem" }}>
					<div className="card-body">
						<h5 className="card-title">Calendar</h5>
					</div>
				</a>
			</React.Fragment>
		);
	}

}