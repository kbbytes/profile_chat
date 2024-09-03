import React, { Component } from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import jwt_decode from 'jwt-decode';
import Avatar, { ConfigProvider } from 'react-avatar';

import MaterialIcon from 'material-icons-react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import GeoIP from '../../../GeoIP/GeoIP';
import Editor from '../../Editor/Editor';
import AvatarEditor from '../../Editor/Avatar';
import './VisualProfile.css';

var _Decoded = null;
class VisualProfile extends Component {
    _isMounted = false;
    constructor() {
        super()
        this.state = {
            id: 0,
            first_name: '',
            last_name: '',
            nickname: '',
            email: '',
            country: '',
            rank: '',
            refferalid: '',
            refferalby: '',
            of_shares: '',
            gender: '',
            age: 0,
            avatar: '',
            copied: false,
            showEditor: false,
            showAvatarEditor: false,
            messages: [],
            unread_messages: 0
        }
        this.toggleEditor = this.toggleEditor.bind(this);
        this.toggleAvatarEditor = this.toggleAvatarEditor.bind(this);
    }

    toggleEditor() {  
        this.setState({  
            showEditor: !this.state.showEditor
        });  
    }

    toggleAvatarEditor() {
        this.setState({showAvatarEditor: !this.state.showAvatarEditor});
    }

    componentDidMount() {
        this._isMounted = true;
        const token = localStorage.usertoken;
        if(token)
        {
            const decoded = jwt_decode(token);
            _Decoded = decoded;
            const date_fixed_created = new Date(decoded.created).toLocaleString();
            const date_fixed_last_login = new Date(decoded.last_login).toLocaleString();
            if(this._isMounted)
            {
                this.setState({ 
                    id: decoded.id,
                    first_name: decoded.first_name,
                    last_name: decoded.last_name,
                    nickname: decoded.nickname,
                    email: decoded.email,
                    country: decoded.country,
                    created: date_fixed_created,
                    last_login: date_fixed_last_login,
                    rank: decoded.rank,
                    refferalid: decoded.refferalid,
                    refferalby: decoded.refferalby,
                    of_shares: decoded.of_shares,
                    gender: decoded.gender,
                    age: decoded.age,
                    avatar: decoded.avatar,
                });
            }
        }
        else
        {
            localStorage.clear();
            this.props.history.push('/');
            window.location.reload(false);
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        if(!this._isMounted)
            return null;
        var Rank_Name = '';
        if(this.state.rank === 1)
            Rank_Name = 'Member';
        else if(this.state.rank === 2)
            Rank_Name = 'Admin';
        else if(this.state.rank === 3)
            Rank_Name = 'Head Admin';
        else if(this.state.rank === 4)
            Rank_Name = 'Owner';
        else
            Rank_Name = 'Guest';
        return (
            
            <ConfigProvider colors={['red', 'green', 'blue']}>
            <>
                {this.state.showEditor ?  
                <Editor/>  
                : null  
                }
                {this.state.showAvatarEditor ?  
                <AvatarEditor decoded={_Decoded}/>  
                : null  
                }
                <div className="jumbotron">
                    <div className="mx-auto">
                        <div className="profile">
                            <h1>PROFILE</h1>
                            <button className="edit-profile-btn" onClick={this.toggleEditor}>
                                <div className="edit-profile">
                                    <MaterialIcon icon="create" />
                                </div>
                            </button>
                        </div>
                    <div className="avatar-profile">
                        <Avatar size="150" round={true} name={ this.state.first_name + ' ' + this.state.last_name} src={`/uploads/avatars/${this.state.avatar}`}  />
                        <button className="edit-avatar-btn" onClick={this.toggleAvatarEditor}>
                            <div className="edit-avatar">
                                <MaterialIcon icon="create" />
                            </div>
                        </button>
                    </div>
                    </div>  
                    <table className="table table-left">
                        <tbody>
                            <tr>
                                <td>ID</td>
                                <td>{ this.state.id }</td>
                            </tr>
                            <tr>
                                <td>First Name</td>
                                <td>{ this.state.first_name }</td>
                            </tr>
                            <tr>
                                <td>Last Name</td>
                                <td>{ this.state.last_name }</td>
                            </tr>
                            <tr>
                                <td>Nickname</td>
                                <td>{ this.state.nickname }</td>
                            </tr>
                            <tr>
                                <td>Age</td>
                                <td>{ this.state.age }</td>
                            </tr>
                            <tr>
                                <td><div className="refferal-headline">Refferal Link</div></td>
                                <td>
                                    <div className="refferal-code">
                                        <a href="/refferals">{ `${this.state.refferalid}` }</a>
                                        <CopyToClipboard text={`${window.location.origin.toString()}/register/?refferal=${this.state.refferalid}` }
                                        onCopy={() => this.setState({copied: true})}>
                                        <div className="copy-btn">
                                            <button><img src="https://img.icons8.com/material-sharp/24/000000/copy.png" alt="C"/></button>
                                        </div>
                                        </CopyToClipboard>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>Refferal By</td>
                                <td>{ this.state.refferalby }</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="hr-v"></div>
                    <table className="table table-right">
                        <tbody>
                            <tr>
                                <td>of Shares</td>
                                <td>
                                    <div className="prog-share">
                                        <CircularProgressbar value={this.state.of_shares} text={`${this.state.of_shares}%`} />
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>Gender</td>
                                <td>{ this.state.gender }</td>
                            </tr>
                            <tr>
                                <td>Email</td>
                                <td>{ this.state.email }</td>
                            </tr>
                            <tr>
                                <td>Country</td>
                                <td>{ this.state.country }</td>
                            </tr>
                            <tr>
                                <td>Rank</td>
                                <td>{ Rank_Name }</td>
                            </tr>
                            <tr>
                                <td>Register Date</td>
                                <td>{ this.state.created }</td>
                            </tr>
                            <tr>
                                <td>Last Login</td>
                                <td>{ this.state.last_login }</td>
                            </tr>
                            <tr>
                                <td>IP Address</td>
                                <td><GeoIP></GeoIP></td>
                            </tr>
                            
                        </tbody>
                    </table>
                </div>
            </>
            </ConfigProvider>
        )
    }
}

export default VisualProfile;