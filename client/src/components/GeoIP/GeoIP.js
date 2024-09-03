import React from 'react';
import fetch from 'node-fetch';

const API = `http://ip-api.com/json/`;

export default class GeoIP extends React.Component {
  _isMounted = false;
  constructor() {
      super();
          
      this.state = {
          ip_address: ''
      }
  }
  componentDidMount() {
    this._isMounted = true;
    fetch(API)
    .then(res => res.json())
    .then(json => {
      if(this._isMounted)
        this.setState({ip_address: json.query});
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return(
        this.state.ip_address
    );
  }
}