import React from "react";
import { Route } from 'react-router-dom';
import ReactLoading from "react-loading";
import fetch from 'node-fetch';

import "bootstrap/dist/css/bootstrap.css";

import Navbar from '../Navbar/Navbar';
import Landing from '../Landing/Landing';
import Login from '../Login/Login';
import Register from '../Register/Register';
import Profile from '../Profile/Profile';
import Refferals from '../Refferals/Refferals';
import Terms from '../Terms/Terms';

import Footer from '../Footer/Footer';
import AppWrapper from '../../AppWrapper';

import './Loading.css';

const API = `http://ip-api.com/json/`;

export default class Loading extends React.Component {
    constructor(props){
       super(props)
       this.state = {
          done: undefined
       }
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({ done: true });
        }, 1000);
        const user_ip = localStorage.getItem('user_ip_address');
        if(!user_ip) {
            fetch(API)
            .then(res => res.json())
            .then(json => {
                localStorage.setItem('user_ip_address', json.IPv4)
            });
        }
    }

    render() {
        return (
           <div>
                {!this.state.done ? (
                    <div id="loading-bars">
                        <ReactLoading type={"bars"} color={"black"} />
                    </div>
              ) : (
                <div className="App">
                    <Navbar/>
                    <Route exact path="/" component={Landing} />
                    <div className="containers">
                        <Route path="/register" component={Register} />           
                        <Route path="/login" component={Login} />
                        <Route path="/profile" component={Profile} />
                        <Route path="/refferals" component={Refferals} />
                        <Route path="/terms" component={Terms} />
                        <Route path="/admin" component={AppWrapper} />
                    </div>
                    <Footer/>
                </div>
              )}
           </div>
        )
     }
 }