import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

export default class UpdateNote extends Component {

	state = {
		error_message: "",
		notes: {}
	}

	componentDidMount = () => {
		this.setState({ notes: this.props.location.state.notes });
		this.notesTitle = this.state.notes.topic;
		this.notesDesc = this.state.notes.description;
	}

	handleUpdateNotes = (e) => {
		e.preventDefault();
		const notesData = {
			"seqnbr": this.state.notes.seqnbr,
			"topic": this.notesTitle || this.state.notes.topic,
			"description": this.notesDesc || this.state.notes.description
		}
		if (localStorage.getItem("token")) {
			axios.post("/notes/updateNotes", notesData).then(
				res => {
					console.log("notes added success", res);
					window.location.replace("/");
				}
			).catch(
				err => {
					console.log("notes deleted failure", err);
					this.handleError(err.response.data.message);
				}
			);
		}
	}

	handleError = (error) => {
		this.setState({ error_message: error });
	}

	render() {
		if (!localStorage.getItem("token")) {
			return <Redirect to={"/login"} />;
		}

		if (!this.state.notes) {
			this.handleError("Unexpected error, please retry from home page");
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
					<h4>You can update your existing note from here...</h4>
					<br />
					{error}
					<form onSubmit={this.handleUpdateNotes}>
						<div className="form-group input-group flex-nowrap">
							<span className="input-group-text" id="notesTitleWrapping">&nbsp;&nbsp;Notes Tilte&nbsp;(max 60 chars)&nbsp;</span>
							<input type="text" className="form-control" placeholder="your title goes here..."
								aria-label="notesTile" aria-describedby="notesTitleWrapping" required="required"
								onChange={e => this.notesTitle = e.target.value} defaultValue={this.state.notes.topic || ''} />
						</div>
						<div className="form-group mb-3">
							<textarea className="form-control" id="notesDesc" rows="10" required="required"
								onChange={e => this.notesDesc = e.target.value} placeholder="Content goes here..."
								defaultValue={this.state.notes.description || ''} ></textarea>
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