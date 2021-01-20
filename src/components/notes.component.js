import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import NotesItem from "./notesitem.component";

export default class Notes extends Component {
	_isMounted = false;

	state = {
		notesData: [],
		error_message: ""
	}

	componentDidMount = () => {
		this._isMounted = true;
		this.handleRefresh();
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	handleRefresh = () => {
		if (localStorage.getItem("token")) {
			axios.get("/notes/getNotes").then(
				res => {
					if (this._isMounted) {
						this.setState({ notesData: res.data });
					}
				}
			).catch(
				err => {
					localStorage.clear();
					window.location.replace("/login");
				}
			);
		}
	}

	handleErrorMessage = (err) => {
		this.setState({ error_message: err });
	}

	handleAddNotesSubmit = () => {
		console.log("redirecting to newnote page");
		window.location.replace("/newnote");
	}

	render() {
		if (!localStorage.getItem("token")) {
			return <Redirect to={"/login"} />;
		}

		let error = "";
		if (this.state.error_message) {
			error = (
				<React.Fragment>
					<br />
					<div className="alert alert-danger justify-content-center" role="alert">
						{this.state.error_message}
					</div>
					<br />
				</React.Fragment>
			);
		}

		return (
			<React.Fragment>
				<br />
				<div className="notes-card d-flex justify-content-between">
					<div className="d-flex flex-row">
						<h4>Hello {this.props.user.firstname}!</h4>
					</div>
					<div className="d-flex flex-row-reverse">
						<button key="addNotesBtn" type="button" className="btn btn-warning"
							onClick={this.handleAddNotesSubmit} >Add a new note</button>
					</div>
				</div>
				{error}
				<br />
				{this.state.notesData.map((input) => {
					return (
						<NotesItem notes={input} key={input.userid + "_" + input.seqnbr}
							notesId={input.userid + "_" + input.seqnbr}
							handleRefresh={this.handleRefresh}
							handleErrorMessage={this.handleErrorMessage} />
					)
				})}
			</React.Fragment>
		);
	}

}