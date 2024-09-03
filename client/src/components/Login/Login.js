import React, { Component } from 'react';
import { login } from '../UserFunctions/UserFunctions';
import ReCAPTCHA from "react-google-recaptcha";
import './Login.css';
import _Conf from '../../configs/global.js';

class Login extends Component {
    constructor() {
        super()
        this.state = {
            email: '',
            password: '',
            last_login_ip: '',
            captcha_token: ''
        }

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.verificationCaptcha = this.verificationCaptcha.bind(this);
    }

    verificationCaptcha(value) {
        this.setState({
            its_not_bot: value
        })
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    onSubmit(e) {
        e.preventDefault();
        const user_ip = localStorage.getItem('user_ip_address');
        const user = {
            email: this.state.email,
            password: this.state.password,
            last_login_ip: user_ip
        }
        login(user).then(res => {
            if(res)
            {
                if(res.banned <= 0) {
                    
                    this.props.history.push(`/profile`);
                    window.location.reload(false);
                }
                else
                {
                    alert(res.reason)
                }
            }
        });
    }

    render() {
        return (
            <div className="limiter">
                <div className="container-login100">
                <div className="wrap-login100">
                    <form className="login100-form validate-form" noValidate onSubmit={this.onSubmit}>
                        <span className="login100-form-logo">
                            <i className="zmdi zmdi-landscape"></i>
                        </span>
    
                        <span className="login100-form-title p-b-34 p-t-27">
                            Sign in
                        </span>
    
                        <div className="wrap-input100 validate-input" data-validate="Enter email">
                            <input 
                                className="input100" 
                                type="email" 
                                name="email"
                                placeholder="Enter Email"
                                value={this.state.email}
                                onChange={this.onChange}
                            />
                            <span className="focus-input100" data-placeholder="&#xf207;"></span>
                        </div>
    
                        <div className="wrap-input100 validate-input" data-validate="Enter password">
                            <input 
                                className="input100" 
                                type="password"
                                name="password"
                                placeholder="Enter password"
                                value={this.state.password}
                                onChange={this.onChange}
                            />
                            <span className="focus-input100" data-placeholder="&#xf191;"></span>
                        </div>
                        <div className="captcha-section">
                            <ReCAPTCHA
                                sitekey={_Conf.Google_Recaptcha}
                                onChange={this.verificationCaptcha}
                            />
                        </div>
                        <div className="container-login100-form-btn">
                            <button 
                                type="submit" 
                                disabled={ (!this.state.email 
                                    || !this.state.password
                                    || !this.state.its_not_bot )}
                                    className="login100-form-btn">
                                Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        )
    }
}

export default Login;