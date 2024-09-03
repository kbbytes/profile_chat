import React, { Component } from 'react';

import './NotFound.css';

class NotFound extends Component {
    constructor() {
        super()
        this.state = {
            to_index: '/' 
        }
    }
    render() {
        return (
            <div className="containers">
            <div className="jumbotron mt-5">
                <div className="col-sm-8 mx-auto">
                    <h1 className="text-center">404 Page not found</h1>
                </div>
            </div>
            </div>
        )
    }
}

export default NotFound;