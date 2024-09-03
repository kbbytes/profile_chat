import "bootstrap/dist/css/bootstrap.min.css";
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import _Conf from './configs/global.js';

ReactDOM.render(<App />, document.querySelector('#root'));
ReactDOM.render(
    _Conf.Title,
    document.getElementsByTagName("title")[0]
 );