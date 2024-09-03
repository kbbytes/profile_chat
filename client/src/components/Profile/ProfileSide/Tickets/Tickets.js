import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { send_ticket } from '../../../UserFunctions/UserFunctions';
import './Tickets.css';

class Tickets extends Component {
    _isMounted = false;
    constructor(props) {
        super(props)
        this.state = {
            owner: '',
            subject: '',
            message: ''
        }
        this.onSubmit_ticket = this.onSubmit_ticket.bind(this);
        this.onChange = this.onChange.bind(this);
    }
    componentDidMount() {
        this._isMounted = true;
        const token = localStorage.usertoken;
        if(!token)
            return <Redirect to="/" />
        
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    onChange(e) {
        if (this._isMounted) {
            this.setState({ [e.target.name]: e.target.value });
        }
    }

    onSubmit_ticket(e) {
        e.preventDefault();
        const token = localStorage.usertoken;
        const decoded = jwt_decode(token);
        const msg = {
            owner: decoded.nickname,
            subject: this.state.subject,
            message: this.state.message
        }
        send_ticket(msg).then(res => {
            if(res) {
                alert('Ticket has been send!');
                this.setState({
                    subject: '',
                    message: ''
                })
                
            }
        });
    }

    render() {
        return (
            <div className="jumbotron">
                <div className="mx-auto">
                    <div className="tickets">
                        <h3>Ticket</h3>
                        <hr></hr>
                    </div>
                    <div className="ticket-form">
                        <div className="row d-flex flex-row py-3">
                            <div className="w-100 px-2 py-1 d-flex flex-row flex-wrap align-items-center justify-content-between">
                                <div className="ticket-form">
                                    <form noValidate onSubmit={this.onSubmit_ticket}>
                                        <div className="form-group">
                                            <label htmlFor="subject">Subject</label>
                                            <input type="text" 
                                            className="form-control"
                                            name="subject"
                                            placeholder="Enter subject of message"
                                            value={this.state.subject}
                                            onChange={this.onChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="message">Message</label>
                                            <textarea type="textarea" 
                                            className="form-control"
                                            name="message"
                                            placeholder="Enter text of message"
                                            value={this.state.message}
                                            onChange={this.onChange}
                                            />
                                        </div>
                                        <button 
                                        type="submit" disabled={ (!this.state.subject
                                            || !this.state.message) }
                                        className="btn btn-lg btn-primary btn-block">
                                            Send Ticket
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Tickets;