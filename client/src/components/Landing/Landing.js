import React, { Component } from 'react';
import { get_banners, inc_views } from '../UserFunctions/UserFunctions';
import _Conf from '../../configs/global.js';

import './Landing.css';

class Landing extends Component {
    _isMounted = false;
    constructor(props){
        super(props)
        this.state = {
           ads_banners: []
        }
     }

    componentDidMount() {
        this._isMounted = true;
        get_banners().then(res => {
            if(res)
            {
                const banners = [];
                res.data.banners.map(banner => {
                    if((banner.status).indexOf('false') === -1)
                        return banners.push(banner);
                    else
                        return null;
                })
                if(this._isMounted)
                    this.setState({ ads_banners: banners})
            }
        });
        inc_views().then(res => {
        })
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        const token = localStorage.usertoken;
        const current_banners = this.state.ads_banners;
        const Not_Registered = (
            <>
                <div className="registered-section">
                    <div className="jumbotron mt-2 welc">
                        <div className="col-sm-4 mx-auto">
                            <h1 className="text-center">{_Conf.Landing._welcome}</h1>
                            <p className="text-center">{_Conf.Landing._day_message}</p>
                        </div>
                    </div>
                    <div className="xyz">
                        <a href="/register"><button type="button" className="chat-btn btn-danger btn-circle btn-sm">Register</button></a>
                        <a href="/login"><button type="button" className="chat-btn btn-success btn-circle btn-sm">Login</button></a>
                    </div>
                </div>
                <div className="ads-section">
                    <ul>
                        { current_banners.map(banner =>    
                            <li key={'Banner_' + banner.id}> 
                                <a href={banner.href} rel="noopener noreferrer" target="_blank"><img src={banner.src} alt={banner.alt} /></a>
                            </li>
                        ) }
                    </ul>
                </div>
            </>
        );

        const Registered = (
            <>
                <div className="unregister-section">
                    <div className="jumbotron mt-2 welc">
                        <div className="col-sm-4 mx-auto">
                            <h1 className="text-center">{_Conf.Landing._welcome}</h1>
                            <p className="text-center">{_Conf.Landing._day_message}</p>
                        </div>
                    </div>
                    <div className="xyz">
                        <a href="/join"><button type="button" className="chat-btn btn-success btn-circle btn-sm">Join Chat</button></a>
                    </div>
                </div>
                <div className="ads-section">
                    <ul>
                        { 
                            current_banners.map(banner =>
                                <li key={'Banner_' + banner.id}> 
                                    <a href={banner.href} rel="noopener noreferrer" target="_blank"><img src={banner.src} alt={banner.alt} /></a>
                                </li>
                            )
                        }
                    </ul>
                </div>
            </>
        );
        return (
            <div className="containers">
                { token ? Registered : Not_Registered }
            </div>
        )
    }
}

export default Landing;