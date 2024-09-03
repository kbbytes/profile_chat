import React, { Component } from 'react';
import jwt_decode from 'jwt-decode';
import ReCAPTCHA from "react-google-recaptcha";
import { editprofile } from '../../UserFunctions/UserFunctions';
import _Conf from '../../../configs/global.js';
import './Editor.css';  

class Editor extends Component {
  _isMounted = false;
  constructor() {
    super()
    this.state = {
        openEditor: false,
        captcha_token: '',
        id: 0,
        first_name: '',
        last_name: '',
        nickname: '',
        country: '',
        curpw: '',
        newpw: '',
        newpwr: '',
        have_new_password: 0
    }
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.closeEditorBox = this.closeEditorBox.bind(this);
    this.verificationCaptcha = this.verificationCaptcha.bind(this);
  }
  componentDidMount() {
    this._isMounted = true;
    const token = localStorage.usertoken;
    if(token)
    {
      this.setState({openEditor: true});
      const decoded = jwt_decode(token);
      this.setState({
          id: decoded.id,
          first_name: decoded.first_name,
          last_name: decoded.last_name,
          nickname: decoded.nickname,
          country: decoded.country
      });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.setState({openEditor: false});
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  closeEditorBox() {  
    this.setState({openEditor: false});
  }

  verificationCaptcha(value) {
    this.setState({
        its_not_bot: value
    })
  }

  onSubmit(e) {
      e.preventDefault();

      const user_pw = {
        id: this.state.id,
        first_name: this.state.first_name,
        last_name: this.state.last_name,
        nickname: this.state.nickname,
        curpw: this.state.curpw,
        newpw: this.state.newpw,
        newpwr: this.state.newpwr,
        have_new_password: 1
      }
      const user_nopw = {
        id: this.state.id,
        first_name: this.state.first_name,
        last_name: this.state.last_name,
        nickname: this.state.nickname,
        have_new_password: 0
      }
      var user = {}
      var pws_is_ok = false
      if(this.state.curpw)
      {
        if(this.state.newpw === this.state.newpwr)
          pws_is_ok = true;     
        else
          pws_is_ok = false;
      }
      if(pws_is_ok)
        user = user_pw;
      else
        user = user_nopw;
        
      editprofile(user);
      
      this.setState({openEditor: false});
  }

  render() {
    var mismatched = false;
    var existpw = false;
    if(this.state.newpw)
    {
      if(this.state.curpw === this.state.newpw)
      existpw = true;
      else
      existpw = false;
    }
    if(this.state.newpw === this.state.newpwr)
      mismatched = false;
    else
      mismatched = true;

    var className_MisMatched = mismatched ? 'visible' : 'invisible';
    var className_ExistPW = existpw ? 'visible' : 'invisible';
    console.log(this.state.avatar);
    const editor = (
      <div id="popup1" className="overlay">
        <div className="popup">
          <h2>Edit Profile</h2>
          <button className="close" onClick={() => this.closeEditorBox()}>&times;</button>
          <div className="content">
            <div className="editor-forms">
              <form noValidate onSubmit={this.onSubmit}>
                <div className="form-group">
                  <label htmlFor="first_name">First Name</label>
                  <input type="text" 
                  className="form-control"
                  name="first_name"
                  placeholder="Enter First Name"
                  value={this.state.first_name}
                  onChange={this.onChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="last_name">Last Name</label>
                  <input type="text" 
                  className="form-control"
                  name="last_name"
                  placeholder="Enter Last Name"
                  value={this.state.last_name}
                  onChange={this.onChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="nickname">Nickname</label>
                  <input type="text" 
                  className="form-control"
                  name="nickname"
                  placeholder="Enter your nickname"
                  value={this.state.nickname}
                  onChange={this.onChange}
                  />
                </div>
                <h3>Change your password if you want</h3>
                <div className="form-group">
                  <label htmlFor="curpw">Current password</label>
                  <input type="password" 
                  className="form-control"
                  name="curpw"
                  placeholder="Enter your current password"
                  value={this.state.curpw}
                  onChange={this.onChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="newpw">New password</label>
                  <input type="password" 
                  className="form-control"
                  name="newpw"
                  placeholder="Enter your new password"
                  value={this.state.newpw}
                  onChange={this.onChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="newpwr">Repeat new password</label>
                  <input type="password" 
                  className="form-control"
                  name="newpwr"
                  placeholder="Enter repeat of new password"
                  value={this.state.newpwr}
                  onChange={this.onChange}
                  />
                </div>
                <div className="form-errors">
                  <ul>
                    <li className={ className_ExistPW }><h4>Same password, choose another one</h4></li>
                    <li className={ className_MisMatched }><h4>New password is not match with repeat</h4></li>
                  </ul>
                </div>
                <ReCAPTCHA
                  sitekey={ _Conf.Google_Recaptcha }
                  onChange={this.verificationCaptcha}
                />
                <button
                type="submit" disabled={ (!this.state.its_not_bot) }
                className="btn btn-lg btn-primary btn-block">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      
    );
    return (
      <>
        { this.state.openEditor ? editor : null }
      </>
    );
  }
}

export default Editor;