import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

export default class Newnote extends Component {

	state = {
		error_message: ""
	}

	handleAddNotes = (e) => {
		e.preventDefault();
		const notesData = {
			"topic": this.notesTitle,
			"description": this.notesDesc
		}
		if (localStorage.getItem("token")) {
			axios.post("/notes/addNotes", notesData).then(
				res => {
					console.log("notes added success", res);
					window.location.replace("/notes");
				}
			).catch(
				err => {
					console.log("notes added failure", err);
					this.setState({ error_message: err.response.data.message });
				}
			);
		}
	}

	render() {
		if (!localStorage.getItem("token")) {
			return <Redirect to={"/login"} />;
		}

		let error = "";
		if (this.state.error_message) {
			error = (
				<div className="alert alert-danger" role="alert">
					{this.state.error_message}
				</div>
			);
		}

		return (
			<React.Fragment>
				<div className="notes-card">
					<br />
					<h4>You can add a new note from here...</h4>
					<br />
					{error}
					<form onSubmit={this.handleAddNotes}>
						<div className="form-group input-group flex-nowrap">
							<span className="input-group-text" id="notesTitleWrapping">&nbsp;&nbsp;Notes Tilte&nbsp;(max 60 chars)&nbsp;</span>
							<input type="text" className="form-control" placeholder="your title goes here..."
								aria-label="notesTile" aria-describedby="notesTitleWrapping" required="required"
								onChange={e => this.notesTitle = e.target.value} />
						</div>
						<div className="form-group mb-3">
							<textarea className="form-control" id="notesDesc" rows="10" required="required"
								onChange={e => this.notesDesc = e.target.value} placeholder="Content goes here..."></textarea>
						</div>
						<div className="form-group notes-card d-flex justify-content-center">
							<div className="d-flex flex-row-reverse">
								<button type="submit" className="btn btn-primary">Save this note</button>
							</div>
						</div>
					</form>
				</div>
			</React.Fragment>
		);
	}

}