import React, { Component } from 'react';
import axios from 'axios';

export default class Register extends Component {

	state = {
		error_message: '',
		notActivated: false,
		register_disabled: false,
		registerBtn_value: "Register"
	};

	validatePassword = (elementValue) => {
		var passwordPattern = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
		return passwordPattern.test(elementValue);
	}

	handleRegisterSubmit = e => {
		e.preventDefault();
		this.setState({ error_message: '' });

		if (!this.validatePassword(this.password)) {
			this.setState({ error_message: "Password not following the criteria" });
			return;
		} else if (this.password !== this.confirmpassword) {
			this.setState({ error_message: "Passwords not matching" });
			return;
		}

		this.setState({
			registerBtn_value: (
				<div className="spinner-border text-light" role="status"></div>
			)
		});
		this.setState({ register_disabled: true });

		const data = {
			email: this.email,
			firstname: this.firstname,
			lastname: this.lastname,
			password: this.password
		}

		axios.post("user/register", data).then(
			res => {
				this.setState({ error_message: '' });
				this.setState({ register_disabled: true });
				this.setState({ notActivated: true });
				this.setState({ registerBtn_value: "Register" });
			}
		).catch(
			err => {
				this.setState({ registerBtn_value: "Register" });
				this.setState({ error_message: err.response.data.message });
				if (this.state.error_message === "Account is not activated - OTP sent to respective mail") {
					this.setState({ register_disabled: true });
					this.setState({ notActivated: true })
				}
			}
		);
	}

	handleOTPActivation = e => {
		e.preventDefault();

		this.setState({ error_message: '' });
		this.setState({
			activateBtn_value: (
				<div className="spinner-border text-light" role="status"></div>
			)
		});

		const data = {
			email: this.email,
			otp: this.activationotp
		}

		axios.post("user/registerOTP", data).then(
			res => {
				this.setState({ activateBtn_value: "Activate" });
				this.setState({ error_message: '' });
				window.alert(res.data.message);
				window.location.replace("/login");
			}
		).catch(
			err => {
				this.setState({ activateBtn_value: "Activate" });
				this.setState({ error_message: err.response.data.message });
			}
		);
	}

	render() {
		let otpsection = "";
		if (this.state.notActivated) {
			otpsection = (
				<React.Fragment>
					<div className="form-group">
						<input type="text" className="form-control" placeholder="OTP" required="required"
							onChange={e => this.activationotp = e.target.value} />
					</div>
					<div className="form-group">
						<button type="button" onClick={this.handleOTPActivation} className="btn btn-secondary btn-block">
							Activate
						</button>
					</div>
				</React.Fragment>
			);
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
			<div className="login-form">
				<form onSubmit={this.handleRegisterSubmit}>
					<h3 className="text-center">Welcome Newbie!</h3>
					<br />
					<div className="form-group">
						<input type="email" className="form-control" placeholder="Email" required="required"
							disabled={(this.state.register_disabled) ? "disabled" : ""}
							onChange={e => this.email = e.target.value} />
					</div>
					<div className="form-group">
						<input type="text" className="form-control" placeholder="First Name" required="required"
							disabled={(this.state.register_disabled) ? "disabled" : ""}
							onChange={e => this.firstname = e.target.value} />
					</div>
					<div className="form-group">
						<input type="text" className="form-control" placeholder="Last Name" required="required"
							disabled={(this.state.register_disabled) ? "disabled" : ""}
							onChange={e => this.lastname = e.target.value} />
					</div>
					<div className="form-group">
						<input type="password" className="form-control" placeholder="Password" required="required"
							disabled={(this.state.register_disabled) ? "disabled" : ""}
							onChange={e => this.password = e.target.value} />
					</div>
					<div className="form-group">
						<input type="password" className="form-control" placeholder="Re-type Password" required="required"
							disabled={(this.state.register_disabled) ? "disabled" : ""}
							onChange={e => this.confirmpassword = e.target.value} />
					</div>
					{error}
					<div className="form-group">
						<button type="submit" className="btn btn-primary btn-block"
							disabled={(this.state.register_disabled) ? "disabled" : ""}>
							{this.state.registerBtn_value}
						</button>
					</div>
					{otpsection}
				</form>
				<p className="text-center">Already been here? <a href="/login">Login</a></p>
			</div>
		);
	}

}