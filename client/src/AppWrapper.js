import { Route, Redirect, BrowserRouter, Switch } from 'react-router-dom';
import React, { Component } from 'react';
import jwt_decode from 'jwt-decode';

import Join from './components/Join/Join';
import Chat from './components/Chat/Chat';
import Admin from './components/Admin/Admin';
import Actions from './components/Admin/Side/Actions/Actions';
import NotFound from './components/NotFound/NotFound';
import Landing from './components/Landing/Landing';

const token = localStorage.usertoken;
var user_rank = 0;
if(token)
{
  const decoded = jwt_decode(token);
  user_rank = decoded.rank;
}

class AppWrapper extends Component{
  render(){

    if(!token)
      return <Redirect to="/login" />

    if(user_rank > 1)
    {
      return (
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route path="/join" component={Join} />
            <Route path="/chat" component={Chat} />
            <Route path="/admin" component={Admin} />
            <Route path="/admin/actions" component={Actions} />
          </Switch>
        </BrowserRouter>
      );
    }
    else
    {
      return (
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route path="/join" component={Join} />
            <Route path="/chat" component={Chat} />
            <Route path="/admin" component={NotFound} />
            <Route path="/admin/*" component={NotFound} />
          </Switch>
        </BrowserRouter>
      );
    }
  }
}

export default AppWrapper;