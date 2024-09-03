import React from 'react';

import { BrowserRouter as Router, Route } from 'react-router-dom';

import AppWrapper from './AppWrapper';

import Loading from "./components/Loading/Loading";

const App = () => (
    <Router>
        <div className="App">
            <Loading />
            <Route path="/chat" component={AppWrapper} />
            <Route path="/join" component={AppWrapper} />
        </div>
    </Router>
);

export default App;