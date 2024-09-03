import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { check_ban } from '../UserFunctions/UserFunctions';

import './Navbar.css';

var check_ban_status = 0;
class Navbar extends Component {
    logOut(e) {
        e.preventDefault();
        localStorage.clear();
        this.props.history.push('/');
        window.location.reload(false);
    }
    constructor(props){
      super(props)
      this.state = {
         user_level: 0,
         user_is_admin: false
      }
   }
 
    componentDidMount() {
      const token = localStorage.usertoken;
        if(token)
        {
          const decoded = jwt_decode(token);
          check_ban_status = setInterval(() => {
              check_ban(decoded.id).then(res => {
                if(res)
                {
                  if(res.data.Status)
                  {
                    alert(res.data.Status);
                    localStorage.clear();
                    this.props.history.push('/');
                    window.location.reload(false);
                  }
                }
              })
          }, 60000);

          let User_Rank_Level = decoded.rank;
          var Is_Admin = false;
          if(User_Rank_Level > 1)
            Is_Admin = true;
          else
            Is_Admin = false;
          
          this.setState({ user_level: User_Rank_Level });
          this.setState({ user_is_admin: Is_Admin });
        }
    }

    componentWillUnmount() {
      clearInterval(check_ban_status);
    }

    render() {
        const loginRegLink = (
          <ul className="navbar-nav">
            <li className="nav-item">
                <Link to="/" className="nav-link">
                    Home
                </Link>
            </li>
            <li className="nav-item">
                <Link to="/login" className="nav-link">
                    Login
                </Link>
            </li>
            <li className="nav-item">
                <Link to="/register" className="nav-link">
                    Register
                </Link>
            </li>
          </ul>
        )
    
        const userLink = (
          <ul className="navbar-nav">
            <li className="nav-item">
                <Link to="/" className="nav-link">
                    Home
                </Link>
            </li>
            <li className="nav-item">
                <Link to="/profile" className="nav-link">
                    Profile
                </Link>
            </li>
            <li className="nav-item">
                <a href="/" onClick={this.logOut.bind(this)} className="nav-link">
                    Logout
                </a>
            </li>
          </ul>
        )

        const userRanked = (
            <ul className="navbar-nav">
                <li className="nav-item">
                    <Link to="/admin" className="nav-link">
                        Admin-Panel
                    </Link>
                </li>
            </ul>
        )
        return (
          <nav className="navbar navbar-expand-lg navbar-dark bg-dark rounded">
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarsExample10"
              aria-controls="navbarsExample10"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
            </button>
    
            <div
              className="collapse navbar-collapse justify-content-md-center"
              id="navbarsExample10"
            >
              {localStorage.usertoken ? userLink : loginRegLink}
            </div>
            <div className="admin-nav">
                    { this.state.user_is_admin ? userRanked : null }
            </div>
          </nav>
        )
      }
}

export default withRouter(Navbar);