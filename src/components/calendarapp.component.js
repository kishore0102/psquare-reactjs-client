import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import Calendarevent from './calendarevent.component';

export default class CalendarApp extends Component {
	_isMounted = false;

	state = {
		calendarData: [],
		error_message: "",
		dateState: "",
		alldayEnabled: false,
		formerror: ""
	}

	componentDidMount = () => {
		this.setState({ dateState: new Date() });
		this._isMounted = true;
		this.handleRefresh();
		this.starttime = "00:00";
		this.endtime = "23:59";
		this.eventoccurs = "ONEDAY";
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	handleAddEventSubmit = () => {
		console.log("add event is clicked");
		console.log("data - ", moment(this.state.dateState).format());
	}

	handleRefresh = () => {
		if (localStorage.getItem("token")) {
			axios.get("/calendar/getCalendar").then(
				res => {
					if (this._isMounted) {
						this.setState({ calendarData: res.data });
					}
				}
			).catch(
				err => {
					this.setState({ error_message: String(err) });
				}
			);
		}
	}

	handleDateChange = (e) => {
		this.setState({ dateState: e });
	}

	handleErrorMessage = (e) => {
		console.log("error in calendar - " + e);
	}

	handleAllDayCheckbox = (e) => {
		this.setState({ alldayEnabled: e.target.checked });
	}

	handleYearlyCheckbox = (e) => {
		console.log(e.target.checked);
		if (e.target.checked) {
			this.eventoccurs = "YEARLY"
		} else {
			this.eventoccurs = "ONEDAY"
		}
	}

	handleAddCalendar = (e) => {
		e.preventDefault();
		if (this.state.alldayEnabled) {
			this.starttime = "00:00";
			this.endtime = "23:59";
		}
		const addCalendarData = {
			"title": this.eventTitle,
			"description": this.eventDesc,
			"starttime": moment(this.state.dateState).format('YYYY-MM-DD') + 'T' + this.starttime + ":00" + moment(this.state.dateState).format('Z'),
			"endtime": moment(this.state.dateState).format('YYYY-MM-DD') + 'T' + this.endtime + ":00" + moment(this.state.dateState).format('Z'),
			"eventoccurs": this.eventoccurs
		};
		console.log(addCalendarData);
		if (localStorage.getItem("token")) {
			axios.post("/calendar/addCalendar", addCalendarData).then(
				res => {
					alert("Event added successfully");
					document.getElementById('addCalendarForm').reset();
					this.handleRefresh();
				}
			).catch(
				err => {
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
				<React.Fragment>
					<br />
					<div className="notes-card">
						<div className="alert alert-danger justify-content-center" role="alert">
							{this.state.error_message}
						</div>
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
						<h4>Calendar</h4>
					</div>
					<div className="d-flex flex-row-reverse">
						<button key="addCalendarBtn" type="button" className="btn btn-warning"
							onClick={this.handleAddEventSubmit}>Add a new event</button>
					</div>
				</div>

				{error}
				<br />

				<div className="container">
					<div className="row">
						<div className="col">
							<Calendar onChange={this.handleDateChange} />
							<br /><br />
						</div>

						<div className="col">
							<form id="addCalendarForm" onSubmit={this.handleAddCalendar}>
								<p>Date - <b>{moment(this.state.dateState).format('Do MMMM, YYYY')}</b></p>
								<div className="form-group input-group flex-nowrap">
									<span className="input-group-text" id="eventTitleWrapping">&nbsp;&nbsp;Event Title&nbsp;&nbsp;</span>
									<input type="text" className="form-control" placeholder="................."
										aria-label="eventTile" aria-describedby="eventTitleWrapping" required
										onChange={e => this.eventTitle = e.target.value} />
								</div>
								<div className="form-group input-group flex-nowrap">
									<span className="input-group-text" id="eventDescWrapping">&nbsp;&nbsp;Event Desc&nbsp;&nbsp;</span>
									<input type="text" className="form-control" placeholder="................."
										aria-label="eventTile" aria-describedby="eventDescWrapping" required
										onChange={e => this.eventDesc = e.target.value} />
								</div>
								<div className="form-group input-group flex-nowrap">
									<div className="input-group-prepend">
										<div className="input-group-text">
											<input className="checkbox" type="checkbox" value="" id="flexCheckDefault"
												onClick={this.handleYearlyCheckbox} />
										</div>
									</div>
									<span className="form-control">Yearly event ?</span>
								</div>
								<div className="form-group input-group flex-nowrap">
									<div className="input-group-prepend">
										<div className="input-group-text">
											<input className="checkbox" type="checkbox" value="" id="flexCheckDefault" onClick={this.handleAllDayCheckbox} />
										</div>
									</div>
									<span className="form-control">All Day</span>
								</div>
								<div className="form-group input-group flex-nowrap">
									<span className="input-group-text" id="eventTitleWrapping">&nbsp;&nbsp;Start Time&nbsp;&nbsp;</span>
									<input className="form-control" type="time" disabled={this.state.alldayEnabled} id="eventStarttimeWrapping" min="00:00" max="23:59"
										defaultValue="00:00" required onChange={e => this.starttime = e.target.value}></input>
								</div>
								<div className="form-group input-group flex-nowrap">
									<span className="input-group-text" id="eventTitleWrapping">&nbsp;&nbsp;End Time&nbsp;&nbsp;</span>
									<input className="form-control" type="time" disabled={this.state.alldayEnabled} id="eventEndtimeWrapping" min="00:00" max="23:59"
										defaultValue="23:59" required onChange={e => this.endtime = e.target.value}></input>
								</div>
								{this.state.formerror ?
									<div className="alert alert-danger justify-content-center" role="alert">
										{this.state.formerror}
									</div>
									:
									<p></p>}
								<div className="form-group event-card d-flex justify-content-between">
									<div className="d-flex flex-row-reverse">
										<button type="submit" className="btn btn-primary">Save this event</button>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>

				{this.state.calendarData.map((input) => {
					if (input.eventoccurs === "ONEDAY" &&
						moment(input.starttime).format('YYYY-MM-DD') === moment(this.state.dateState).format('YYYY-MM-DD')) {
						return (
							<Calendarevent event={input} key={input.userid + "_" + input.seqnbr}
								eventId={input.userid + "_" + input.seqnbr}
								handleRefresh={this.handleRefresh}
								handleErrorMessage={this.handleErrorMessage} />
						);
					} else if (input.eventoccurs === "YEARLY" &&
						moment(input.starttime).format('MM-DD') === moment(this.state.dateState).format('MM-DD')) {
						return (
							<Calendarevent event={input} key={input.userid + "_" + input.seqnbr}
								eventId={input.userid + "_" + input.seqnbr}
								handleRefresh={this.handleRefresh}
								handleErrorMessage={this.handleErrorMessage} />
						);
					} else {
						return (<div></div>);
					}
				})

				}


			</React.Fragment>
		);
	}

}