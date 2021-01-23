import axios from 'axios';
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

export default class Login extends Component {

	state = {
		error_message: '',
		notActivated: false,
		login_disabled: false,
		loginBtn_value: "Login",
		activateBtn_value: "Activate"
	};

	handleLoginSubmit = e => {
		e.preventDefault();

		this.setState({ error_message: '' });
		this.setState({
			loginBtn_value: (
				<div className="spinner-border text-light" role="status"></div>
			)
		});

		const data = {
			email: this.email,
			password: this.password
		}
		this.setState({ login_disabled: true });

		axios.post("user/login", data).then(
			res => {
				this.setState({ loginBtn_value: "Login" });
				this.setState({ error_message: '' });
				localStorage.setItem("token", res.data.token);
				window.location.replace("/");
			}
		).catch(
			err => {
				this.setState({ loginBtn_value: "Login" });
				console.log("login error", err.response);
				this.setState({ error_message: err.response.data.message });
				if (this.state.error_message === "Account is not activated - OTP sent to respective mail") {
					this.setState({ notActivated: true });
				} else {
					this.setState({ login_disabled: false });
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
		console.log("otp entered - " + this.activationotp);
		axios.post("user/registerOTP", data).then(
			res => {
				this.setState({ activateBtn_value: "Activate" });
				this.setState({ notActivated: false });
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
		if (localStorage.getItem("token")) {
			return <Redirect to={"/"} />;
		}

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
							{this.state.activateBtn_value}
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
				<form onSubmit={this.handleLoginSubmit}>
					<h3 className="text-center">Welcome Back!</h3>
					<br />
					<div className="form-group">
						<input type="email" className="form-control" placeholder="Email" required="required"
							disabled={(this.state.login_disabled) ? "disabled" : ""}
							onChange={e => this.email = e.target.value} />
					</div>
					<div className="form-group">
						<input type="password" className="form-control" placeholder="Password" required="required"
							disabled={(this.state.login_disabled) ? "disabled" : ""}
							onChange={e => this.password = e.target.value} />
					</div>
					{error}
					<div className="form-group">
						<button type="submit" className="btn btn-primary btn-block"
							disabled={(this.state.login_disabled) ? "disabled" : ""} >{this.state.loginBtn_value}</button>
					</div>

					{otpsection}

					<div className="clearfix">
						<a href="/" className="float-right">Forgot Password?</a>
					</div>
				</form>
				<p className="text-center">New here? <a href="/register">Create an Account</a></p>
			</div>
		);
	}

}
