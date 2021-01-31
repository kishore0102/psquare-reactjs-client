import { PlusCircleIcon, NoEntryIcon, PencilIcon, CircleSlashIcon } from "@primer/octicons-react";
import React, { Component } from "react";
import axios from 'axios';
import { Redirect } from "react-router-dom";

export default class Calendarevent extends Component {

	state = {
		event: {},
		titleEditable: false,
		descEditable: false
	}

	componentDidMount = () => {
		this.setState({ event: this.props.event });
	}

	handleCollapse = () => {
		if (this.state.showDesc) {
			this.setState({ showDesc: false });
		} else {
			this.setState({ showDesc: true });
		}
	}

	handleDeleteEvent = () => {
		console.log("delete - " + this.state.event.userid + " & " + this.state.event.seqnbr);
		let calendarData = {
			"seqnbr": this.state.event.seqnbr
		};
		if (localStorage.getItem("token")) {
			if (!window.confirm("Delete the event?")) {
				return;
			}
			axios.post("/calendar/deleteCalendar", calendarData).then(
				res => {
					console.log("event deleted success", res);
					this.props.handleRefresh();
				}
			).catch(
				err => {
					console.log("event deleted failure", err.response.data.message);
					this.props.handleErrorMessage(err.response.data.message);
				}
			);
		}
	}

	handleEditEvent = () => {
		// this.setState({ showDesc: true });
		// this.setState({ titleEditable: true });
		// this.setState({ descEditable: true });
	}

	render() {
		if (!localStorage.getItem("token")) {
			return <Redirect to={"/login"} />;
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
					<span contentEditable={this.state.descEditable}>{this.state.event.description}</span>
				</div>
			);
		}

		return (
			<React.Fragment>
				<div className="card notes-card">
					<div className="card-header d-flex justify-content-between">
						<div className="d-flex flex-row">
							<h5>
								<button key={this.props.evnetId + "_expandBtn"} type="button" className="btn btn-link"
									onClick={this.handleCollapse} data-toggle="collapse"
									data-target={"#" + this.props.eventId}>
									{expandIcon}
								</button>
								&nbsp;&nbsp;<span contentEditable={this.state.titleEditable}>{this.state.event.title}</span>
							</h5>
						</div>
						<div className="d-flex flex-row-reverse">
							<button key={this.props.evnetId + "_deleteBtn"} type="button" className="btn btn-link"
								data-toggle="collapse" onClick={this.handleDeleteEvent}>
								<CircleSlashIcon size={16} />
							</button>
							<button key={this.props.evnetId + "_editBtn"} type="button" className="btn btn-link"
								data-toggle="collapse" onClick={this.handleEditEvent}>
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