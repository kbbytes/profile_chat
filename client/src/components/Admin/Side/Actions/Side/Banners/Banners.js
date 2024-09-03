import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import './Banners.css';
import { editBanner } from '../../../../../UserFetcher/UserFetcher';
import { get_banners } from '../../../../../UserFunctions/UserFunctions';
import jwt_decode from 'jwt-decode';

var selectedBANNER = {};
var Banners_Fetcher = 0;
class Banners extends Component {
    _isMounted = false;
    constructor(props) {
        super(props)
        this.state = {
            showEditBox: false,
            settings_banners: [],
            id: 0,
            status: 'false',
            alt: '',
            src: '',
            href: '',
            have_users_view: 0,
            have_bans_view: 0,
            have_logs_view: 0,
            have_tickets_view: 0,
            have_SPM_view: 0,
            have_admins_view: 0,
            have_rooms_view: 0,
            have_banners_view: 0,
            have_stats_view: 0
        }
        this.EditBanner = this.EditBanner.bind(this);
        this.EditBannerPopup = this.EditBannerPopup.bind(this);
        this.onChange = this.onChange.bind(this);
        this.closeEditBox = this.closeEditBox.bind(this);
    }

    closeEditBox() {  
        selectedBANNER = {};
        get_banners().then(res => {
            const banners = res.data.banners;
            if(this._isMounted)
            {
                this.setState({ settings_banners: banners })
            }
        });
    }

    componentDidMount() {
        this._isMounted = true;
        const token = localStorage.usertoken;
        if(!token)
            return <Redirect to="/" />

        const decoded = jwt_decode(token);

        this.setState({ 
            have_banners_view: decoded.have_banners_view
        })
        get_banners().then(res => {
            const banners = res.data.banners;
            if(this._isMounted)
            {
                this.setState({ settings_banners: banners })
            }
        });

        Banners_Fetcher = setInterval(() => {
            get_banners().then(res => {
                const banners = res.data.banners;
                if(this._isMounted)
                {
                    this.setState({ settings_banners: banners })
                }
            });
        }, 10000)
    }

    componentWillUnmount() {
        this._isMounted = false;
        clearInterval(Banners_Fetcher);
    }

    onChange(e) {
        if (this._isMounted) {
            this.setState({ [e.target.name]: e.target.value });
        }
    }

    EditBanner(Banner) {
        if(Banner.id === 0)
            Banner.id = selectedBANNER.id;
        if(Banner.alt === '')
            Banner.alt = selectedBANNER.alt;
        if(Banner.src === '')
            Banner.src = selectedBANNER.src;
        if(Banner.href === '')
            Banner.href = selectedBANNER.href;
        editBanner(Banner);

        get_banners().then(res => {
            const banners = res.data.banners;
            if(this._isMounted)
            {
                this.setState({ settings_banners: banners })
            }
        });

        selectedBANNER = {};
    }

    EditBannerPopup(banner) {
        this.setState({
            id: banner.id,
            status: banner.status,
            alt: banner.alt,
            src: banner.src,
            href: banner.href
        })
        selectedBANNER = {
            id: banner.id,
            status: banner.status,
            alt: banner.alt,
            src: banner.src,
            href: banner.href
        }
    }

    render() {
        const dont_have_perm = (
            <div className="jumbotron">
              <div className="row">
                  <div className="low-perm">
                      <div>
                        <h2>You don't have premission</h2>
                      </div>
                  </div>
              </div>
            </div>
          );
  
          if(!this.state.have_banners_view)
            return dont_have_perm;
        var status_to_number = 0;
        if(selectedBANNER.status === 'true')
        {
            status_to_number = 1;
        }
        else
            status_to_number = 0;
        const show_banner_edit_popup = (
            <div id="popup1" className="overlay">
                <div className="popup">
                    <h2>edit banner {selectedBANNER.alt}</h2>
                    <button className="close" onClick={() => this.closeEditBox()}>&times;</button>
                    <hr></hr>
                    <div className="content">
                        <div className="banner-setting">
                            <ul>
                                <li>
                                    <a href={selectedBANNER.href} rel="noopener noreferrer" target="_blank"><img src={selectedBANNER.src} alt={selectedBANNER.alt} /></a>
                                </li>
                                <li>
                                    <div className="banner-detail">
                                        <p>Banner Status: <span className={ status_to_number ? 'banner-enable' : 'banner-disable' }>{ status_to_number ? 'Enable' : 'Disable' }</span></p>
                                        <p>Banner Alt: { selectedBANNER.alt }</p>
                                        <p>Banner Path: { selectedBANNER.src }</p>
                                        <p>Banner Link: { selectedBANNER.href }</p>
                                    </div>
                                </li>
                            </ul>
                            <div className="form-group">
                            <fieldset data-role="controlgroup">
                            <legend>Choose your gender:</legend>
                                <label htmlFor="true">Enable</label>
                                <input 
                                type="radio" 
                                name="status" 
                                id="true" 
                                value='true' 
                                checked={this.state.status === 'true'} 
                                onChange={this.onChange}/>
                                <label htmlFor="false">Disable</label>
                                <input type="radio" 
                                name="status" 
                                id="false" 
                                value='false' 
                                checked={this.state.status === 'false'}
                                onChange={this.onChange}
                                />
                            </fieldset>
                            </div>
                            <div className="form-group">
                                <label htmlFor="alt">Alt</label>
                                <input type="text" 
                                className="form-control"
                                name="alt"
                                placeholder="Enter alt for image"
                                value={this.state.alt}
                                onChange={this.onChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="src">Image path</label>
                                <input type="text" 
                                className="form-control"
                                name="src"
                                placeholder="Enter path for image"
                                value={this.state.src}
                                onChange={this.onChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="href">Link</label>
                                <input type="text" 
                                className="form-control"
                                name="href"
                                placeholder="Enter link for image"
                                value={this.state.href}
                                onChange={this.onChange}
                                />
                            </div>
                            <div className="button-save-edit">
                                <button 
                                type="submit"
                                className="btn btn-lg btn-primary btn-block"
                                onClick={() => { this.EditBanner({
                                    id: this.state.id,
                                    status: this.state.status,
                                    alt: this.state.alt,
                                    src: this.state.src,
                                    href: this.state.href
                                }) } }
                                >
                                Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
        const current_banners = this.state.settings_banners;
        return (
            <div className="jumbotron">
                <div className="row mb-0-admin">
                    <div className="banners-list">
                        <h3>Banners</h3>
                    </div>
                    <div className="mb-5">
                        <div className="row d-flex flex-row py-3 mb-0-admin">
                            <div className="w-100 px-2 py-1 d-flex flex-row flex-wrap align-items-center justify-content-between">
                                <div className="d-flex flex-row align-items-center">
                                    <div className="ads-section admin-banners-settings">
                                        <ul>
                                            { current_banners.map((banner, index) =>
                                                <li key={'Banner_' + banner.id}>
                                                    <a href={banner.href} rel="noopener noreferrer" target="_blank"><img src={banner.src} alt={banner.alt} /></a>
                                                    <button className="btn btn-success" onClick={() => this.EditBannerPopup(banner)}>Edit</button>
                                                </li>
                                            ) }
                                        </ul>
                                        { selectedBANNER.id > 0 ? show_banner_edit_popup : null }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Banners;