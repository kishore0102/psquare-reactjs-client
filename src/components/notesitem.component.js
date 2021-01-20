import { PlusCircleIcon, NoEntryIcon, PencilIcon, CircleSlashIcon } from "@primer/octicons-react";
import React, { Component } from "react";
import axios from 'axios';
import { Redirect } from "react-router-dom";

export default class Notes extends Component {

	state = {
		showDesc: false,
		notes: {},
		editRedirect: false
	}

	componentDidMount = () => {
		this.setState({ notes: this.props.notes });
	}

	handleCollapse = () => {
		if (this.state.showDesc) {
			this.setState({ showDesc: false });
		} else {
			this.setState({ showDesc: true });
		}
	}

	handleDeleteNotes = () => {
		console.log("delete - " + this.state.notes.userid + " & " + this.state.notes.seqnbr);
		let notesData = {
			"seqnbr": this.state.notes.seqnbr
		};
		if (localStorage.getItem("token")) {
			if (!window.confirm("Delete the item?")) {
				return;
			}
			axios.post("/notes/deleteNotes", notesData).then(
				res => {
					console.log("notes deleted success", res);
					this.props.handleRefresh();
				}
			).catch(
				err => {
					console.log("notes deleted failure", err.response.data.message);
					this.props.handleErrorMessage(err.response.data.message);
				}
			);
		}
	}

	handleEditNotes = () => {
		this.setState({ editRedirect: true });
	}

	render() {
		if (!localStorage.getItem("token")) {
			return <Redirect to={"/login"} />;
		}

		if (this.state.editRedirect) {
			return (
				<Redirect
					to={{
						pathname: "/updatenote",
						state: { notes: this.state.notes }
					}}
				/>)
				;
		}

		let expandData = (
			<div></div>
		);
		let expandIcon = (
			<PlusCircleIcon onClick={this.handleCollapse} size={16} />
		);
		if (this.state.showDesc) {
			expandIcon = (
				<NoEntryIcon onClick={this.handleCollapse} size={16} />
			);
			expandData = (
				<div className="card-body">
					{this.state.notes.description}
				</div>
			);
		}

		return (
			<React.Fragment>
				<div className="card notes-card">
					<div className="card-header d-flex justify-content-between">
						<div className="d-flex flex-row">
							<h5>
								<button key={this.props.notesId + "_expandBtn"} type="button" className="btn btn-link"
									onClick={this.handleCollapse} data-toggle="collapse"
									data-target={"#" + this.props.notesId}>
									{expandIcon}
								</button>
									&nbsp;&nbsp;{this.state.notes.topic}
							</h5>
						</div>
						<div className="d-flex flex-row-reverse">
							<button key={this.props.notesId + "_deleteBtn"} type="button" className="btn btn-link"
								data-toggle="collapse" onClick={this.handleDeleteNotes}>
								<CircleSlashIcon size={16} />
							</button>
							{/* <a href={"/updatenote/" + this.state.notes.seqnbr}><CircleSlashIcon size={16} /></a> */}
							<button key={this.props.notesId + "_editBtn"} type="button" className="btn btn-link"
								data-toggle="collapse" onClick={this.handleEditNotes}>
								<PencilIcon size={16} />
							</button>
						</div>
					</div>

					{expandData}
				</div>
			</React.Fragment >
		);
	}

}