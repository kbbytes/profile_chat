import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { register } from '../UserFunctions/UserFunctions';
import fetch from 'node-fetch';
import Voucher from 'voucher-code-generator';
import axios from 'axios';
import ReCAPTCHA from "react-google-recaptcha";
import _Conf from '../../configs/global.js';

import './Register.css';

const qs = require('query-string');

const API = `http://ip-api.com/json/`;

export const DataFetcher = Data => {
    return axios
    .post('/fetcher', { data: Data })
    .then(res => {
        localStorage.setItem('refferel_by_name', res.data);
    })
    .catch(error => {
        console.log(error);
    })
}

class Register extends Component {
    constructor() {
        super()
        this.state = {
            first_name: '',
            last_name: '',
            nickname: '',
            gender: '',
            email: '',
            password: '',
            country: '',
            register_ip: '',
            rank: 0,
            birthdate: '',
            refferalid: "",
            refferalby: '',
            refferalbyname: '',
            haverefferal: false,
            datafetched: false,
            of_shares: 0.0,
            is_agreement: '',
            captcha_token: ''
        }

        this.onChange= this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.verificationCaptcha = this.verificationCaptcha.bind(this);
    }

    verificationCaptcha(value) {
        this.setState({
            its_not_bot: value
        })
    }

    componentDidMount() {
        fetch(API)
        .then(res => res.json())
        .then(json => {
          this.setState({register_ip: json.IPv4});
          var Refferal_ID = []
          try {
              Refferal_ID = Voucher.generate
              (
                  {
                      length: 10,
                      count: 0,
                      charset: Voucher.charset("alphanumeric")
                  }
              )
            this.setState({refferalid: Refferal_ID})
            }
            catch (err) {
                console.log("Sorry, not possible, ERROR: 57")
            }
            var parsed = qs.parse(this.props.location.search)
            if(parsed.refferal === undefined)
            {
                const refferal_by = localStorage.refferal_by;
                const refferel_by_name = localStorage.refferel_by_name;
                if(refferal_by)
                {
                    this.setState({ refferalby: refferal_by })
                    this.setState({ refferalbyname: refferel_by_name })
                    this.setState({ haverefferal: true })
                    localStorage.removeItem('refferal_by');
                    localStorage.removeItem('refferel_by_name');
                }
            }
        });
        if(!this.state.datafetched)
        {
            this.setState({ datafetched: true });
        }
      }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    onSubmit(e) {
        e.preventDefault();

        const user = {
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            nickname: this.state.nickname,
            gender: this.state.gender,
            email: this.state.email,
            password: this.state.password,
            country: this.state.country,
            register_ip: this.state.register_ip,
            rank: 1,
            birthdate: this.state.birthdate,
            refferalid: this.state.refferalid[0],
            refferalby: this.state.refferalby,
            of_shares: 0.0,
            is_agreement: this.state.is_agreement
        }
        register(user).then(res => {
            if(res.data.error)
                alert(res.data.error);
            else
            {
                alert(res.data.status);
                this.props.history.push(`/login`);
            }
        });
    }

    render() {
        const token = localStorage.usertoken;
        if(token)
            return <Redirect to="/profile" />

        var parsed = qs.parse(this.props.location.search)
        if(parsed.refferal !== undefined)
        {
            localStorage.setItem('refferal_by', parsed.refferal);
            const refferal_by = localStorage.refferal_by;
            if(refferal_by)
            {     
                if(!this.state.datafetched)
                {
                    DataFetcher(refferal_by);
                }
            }

            if(refferal_by)
            {
                return <Redirect to="/register" />
            }
        }
        const Have_Refferal_Section = (
            <div className="refferal-section">
                <p>You have been invited by <span>{ this.state.refferalbyname }</span> refferal code.</p>
            </div>
        )
        return (
            <div className="limiter">
                <div className="container-register100">
                <div className="wrap-register100">
                    <form className="register100-form validate-form" noValidate onSubmit={this.onSubmit}>
                        <span className="register100-form-logo">
                            <i className="zmdi zmdi-landscape"></i>
                        </span>
    
                        <span className="register100-form-title p-b-34 p-t-27">
                            Sign up
                        </span>
                        { this.state.haverefferal ? Have_Refferal_Section : null }
                        <div className="wrap-input100 validate-input" data-validate="Enter first name">
                            <input 
                                className="input100" 
                                type="text" 
                                name="first_name"
                                placeholder="Enter First Name"
                                value={this.state.first_name}
                                onChange={this.onChange}
                            />
                            <span className="focus-input100" data-placeholder="&#xf205;"></span>
                        </div>

                        <div className="wrap-input100 validate-input" data-validate="Enter last name">
                            <input 
                                className="input100" 
                                type="text" 
                                name="last_name"
                                placeholder="Enter Last Name"
                                value={this.state.last_name}
                                onChange={this.onChange}
                            />
                            <span className="focus-input100" data-placeholder="&#xf205;"></span>
                        </div>

                        <div className="wrap-input100 validate-input" data-validate="Enter nickname">
                            <input 
                                className="input100" 
                                type="text" 
                                name="nickname"
                                placeholder="Enter Nickname"
                                value={this.state.nickname}
                                onChange={this.onChange}
                            />
                            <span className="focus-input100" data-placeholder="&#xf207;"></span>
                        </div>

                        <div className="wrap-input100 validate-input" data-validate="Select gender">
                            <fieldset data-role="controlgroup">
                                <ul>
                                    <li>
                                        <label htmlFor="male">Male</label>
                                        <input 
                                        type="radio" 
                                        name="gender" 
                                        id="male" 
                                        value='male' 
                                        checked={this.state.gender === 'male'} 
                                        onChange={this.onChange}/>
                                    </li>
                                    <li>
                                        <label htmlFor="female">Female</label>
                                        <input type="radio" 
                                        name="gender" 
                                        id="female" 
                                        value='female' 
                                        checked={this.state.gender === 'female'}
                                        onChange={this.onChange}
                                        />
                                    </li>
                                </ul>
                            </fieldset>
                        </div>
                        <div className="wrap-input100 validate-input" data-validate="Enter email address">
                            <input 
                                className="input100" 
                                type="text" 
                                name="email"
                                placeholder="Enter email address"
                                value={this.state.email}
                                onChange={this.onChange}
                            />
                            <span className="focus-input100" data-placeholder="&#xf159;"></span>
                        </div>
                        <div className="wrap-input100 validate-input" data-validate="Enter password">
                            <input 
                                className="input100" 
                                type="password"
                                name="password"
                                placeholder="Enter password"
                                value={this.state.password}
                                onChange={this.onChange}
                            />
                            <span className="focus-input100" data-placeholder="&#xf191;"></span>
                        </div>
                        <div className="wrap-input100 validate-input" data-validate="Enter birthday">
                            <input 
                                className="input100" 
                                type="date"
                                name="birthdate"
                                min="1960-01-01" 
                                step="7"
                                value={ this.state.birthdate }
                                onChange={this.onChange}
                            />
                            <span className="focus-input100" data-placeholder="&#xf122;"></span>
                        </div>
                        <div className="wrap-input100 validate-input" data-validate="Enter country">
                            <select 
                                className="input100" 
                                id="country"
                                name="country"
                                value={this.state.country}
                                onChange={this.onChange}
                                >
                                <option value="">Select your country</option>
                                <option value="Afghanistan">Afghanistan</option>
                                <option value="Åland Islands">Åland Islands</option>
                                <option value="Albania">Albania</option>
                                <option value="Algeria">Algeria</option>
                                <option value="American Samoa">American Samoa</option>
                                <option value="Andorra">Andorra</option>
                                <option value="Angola">Angola</option>
                                <option value="Anguilla">Anguilla</option>
                                <option value="Antarctica">Antarctica</option>
                                <option value="Antigua and Barbuda">Antigua and Barbuda</option>
                                <option value="Argentina">Argentina</option>
                                <option value="Armenia">Armenia</option>
                                <option value="Aruba">Aruba</option>
                                <option value="Australia">Australia</option>
                                <option value="Austria">Austria</option>
                                <option value="Azerbaijan">Azerbaijan</option>
                                <option value="Bahamas">Bahamas</option>
                                <option value="Bahrain">Bahrain</option>
                                <option value="Bangladesh">Bangladesh</option>
                                <option value="Barbados">Barbados</option>
                                <option value="Belarus">Belarus</option>
                                <option value="Belgium">Belgium</option>
                                <option value="Belize">Belize</option>
                                <option value="Benin">Benin</option>
                                <option value="Bermuda">Bermuda</option>
                                <option value="Bhutan">Bhutan</option>
                                <option value="Bolivia">Bolivia</option>
                                <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
                                <option value="Botswana">Botswana</option>
                                <option value="Bouvet Island">Bouvet Island</option>
                                <option value="Brazil">Brazil</option>
                                <option value="British Indian Ocean Territory">British Indian Ocean Territory</option>
                                <option value="Brunei Darussalam">Brunei Darussalam</option>
                                <option value="Bulgaria">Bulgaria</option>
                                <option value="Burkina Faso">Burkina Faso</option>
                                <option value="Burundi">Burundi</option>
                                <option value="Cambodia">Cambodia</option>
                                <option value="Cameroon">Cameroon</option>
                                <option value="Canada">Canada</option>
                                <option value="Cape Verde">Cape Verde</option>
                                <option value="Cayman Islands">Cayman Islands</option>
                                <option value="Central African Republic">Central African Republic</option>
                                <option value="Chad">Chad</option>
                                <option value="Chile">Chile</option>
                                <option value="China">China</option>
                                <option value="Christmas Island">Christmas Island</option>
                                <option value="Cocos (Keeling) Islands">Cocos (Keeling) Islands</option>
                                <option value="Colombia">Colombia</option>
                                <option value="Comoros">Comoros</option>
                                <option value="Congo">Congo</option>
                                <option value="Congo, The Democratic Republic of The">Congo, The Democratic Republic of The</option>
                                <option value="Cook Islands">Cook Islands</option>
                                <option value="Costa Rica">Costa Rica</option>
                                <option value="Cote D'ivoire">Cote D'ivoire</option>
                                <option value="Croatia">Croatia</option>
                                <option value="Cuba">Cuba</option>
                                <option value="Cyprus">Cyprus</option>
                                <option value="Czech Republic">Czech Republic</option>
                                <option value="Denmark">Denmark</option>
                                <option value="Djibouti">Djibouti</option>
                                <option value="Dominica">Dominica</option>
                                <option value="Dominican Republic">Dominican Republic</option>
                                <option value="Ecuador">Ecuador</option>
                                <option value="Egypt">Egypt</option>
                                <option value="El Salvador">El Salvador</option>
                                <option value="Equatorial Guinea">Equatorial Guinea</option>
                                <option value="Eritrea">Eritrea</option>
                                <option value="Estonia">Estonia</option>
                                <option value="Ethiopia">Ethiopia</option>
                                <option value="Falkland Islands (Malvinas)">Falkland Islands (Malvinas)</option>
                                <option value="Faroe Islands">Faroe Islands</option>
                                <option value="Fiji">Fiji</option>
                                <option value="Finland">Finland</option>
                                <option value="France">France</option>
                                <option value="French Guiana">French Guiana</option>
                                <option value="French Polynesia">French Polynesia</option>
                                <option value="French Southern Territories">French Southern Territories</option>
                                <option value="Gabon">Gabon</option>
                                <option value="Gambia">Gambia</option>
                                <option value="Georgia">Georgia</option>
                                <option value="Germany">Germany</option>
                                <option value="Ghana">Ghana</option>
                                <option value="Gibraltar">Gibraltar</option>
                                <option value="Greece">Greece</option>
                                <option value="Greenland">Greenland</option>
                                <option value="Grenada">Grenada</option>
                                <option value="Guadeloupe">Guadeloupe</option>
                                <option value="Guam">Guam</option>
                                <option value="Guatemala">Guatemala</option>
                                <option value="Guernsey">Guernsey</option>
                                <option value="Guinea">Guinea</option>
                                <option value="Guinea-bissau">Guinea-bissau</option>
                                <option value="Guyana">Guyana</option>
                                <option value="Haiti">Haiti</option>
                                <option value="Heard Island and Mcdonald Islands">Heard Island and Mcdonald Islands</option>
                                <option value="Holy See (Vatican City State)">Holy See (Vatican City State)</option>
                                <option value="Honduras">Honduras</option>
                                <option value="Hong Kong">Hong Kong</option>
                                <option value="Hungary">Hungary</option>
                                <option value="Iceland">Iceland</option>
                                <option value="India">India</option>
                                <option value="Indonesia">Indonesia</option>
                                <option value="Iran, Islamic Republic of">Iran, Islamic Republic of</option>
                                <option value="Iraq">Iraq</option>
                                <option value="Ireland">Ireland</option>
                                <option value="Isle of Man">Isle of Man</option>
                                <option value="Israel">Israel</option>
                                <option value="Italy">Italy</option>
                                <option value="Jamaica">Jamaica</option>
                                <option value="Japan">Japan</option>
                                <option value="Jersey">Jersey</option>
                                <option value="Jordan">Jordan</option>
                                <option value="Kazakhstan">Kazakhstan</option>
                                <option value="Kenya">Kenya</option>
                                <option value="Kiribati">Kiribati</option>
                                <option value="Korea, Democratic People's Republic of">Korea, Democratic People's Republic of</option>
                                <option value="Korea, Republic of">Korea, Republic of</option>
                                <option value="Kuwait">Kuwait</option>
                                <option value="Kyrgyzstan">Kyrgyzstan</option>
                                <option value="Lao People's Democratic Republic">Lao People's Democratic Republic</option>
                                <option value="Latvia">Latvia</option>
                                <option value="Lebanon">Lebanon</option>
                                <option value="Lesotho">Lesotho</option>
                                <option value="Liberia">Liberia</option>
                                <option value="Libyan Arab Jamahiriya">Libyan Arab Jamahiriya</option>
                                <option value="Liechtenstein">Liechtenstein</option>
                                <option value="Lithuania">Lithuania</option>
                                <option value="Luxembourg">Luxembourg</option>
                                <option value="Macao">Macao</option>
                                <option value="Macedonia, The Former Yugoslav Republic of">Macedonia, The Former Yugoslav Republic of</option>
                                <option value="Madagascar">Madagascar</option>
                                <option value="Malawi">Malawi</option>
                                <option value="Malaysia">Malaysia</option>
                                <option value="Maldives">Maldives</option>
                                <option value="Mali">Mali</option>
                                <option value="Malta">Malta</option>
                                <option value="Marshall Islands">Marshall Islands</option>
                                <option value="Martinique">Martinique</option>
                                <option value="Mauritania">Mauritania</option>
                                <option value="Mauritius">Mauritius</option>
                                <option value="Mayotte">Mayotte</option>
                                <option value="Mexico">Mexico</option>
                                <option value="Micronesia, Federated States of">Micronesia, Federated States of</option>
                                <option value="Moldova, Republic of">Moldova, Republic of</option>
                                <option value="Monaco">Monaco</option>
                                <option value="Mongolia">Mongolia</option>
                                <option value="Montenegro">Montenegro</option>
                                <option value="Montserrat">Montserrat</option>
                                <option value="Morocco">Morocco</option>
                                <option value="Mozambique">Mozambique</option>
                                <option value="Myanmar">Myanmar</option>
                                <option value="Namibia">Namibia</option>
                                <option value="Nauru">Nauru</option>
                                <option value="Nepal">Nepal</option>
                                <option value="Netherlands">Netherlands</option>
                                <option value="Netherlands Antilles">Netherlands Antilles</option>
                                <option value="New Caledonia">New Caledonia</option>
                                <option value="New Zealand">New Zealand</option>
                                <option value="Nicaragua">Nicaragua</option>
                                <option value="Niger">Niger</option>
                                <option value="Nigeria">Nigeria</option>
                                <option value="Niue">Niue</option>
                                <option value="Norfolk Island">Norfolk Island</option>
                                <option value="Northern Mariana Islands">Northern Mariana Islands</option>
                                <option value="Norway">Norway</option>
                                <option value="Oman">Oman</option>
                                <option value="Pakistan">Pakistan</option>
                                <option value="Palau">Palau</option>
                                <option value="Palestinian Territory, Occupied">Palestinian Territory, Occupied</option>
                                <option value="Panama">Panama</option>
                                <option value="Papua New Guinea">Papua New Guinea</option>
                                <option value="Paraguay">Paraguay</option>
                                <option value="Peru">Peru</option>
                                <option value="Philippines">Philippines</option>
                                <option value="Pitcairn">Pitcairn</option>
                                <option value="Poland">Poland</option>
                                <option value="Portugal">Portugal</option>
                                <option value="Puerto Rico">Puerto Rico</option>
                                <option value="Qatar">Qatar</option>
                                <option value="Reunion">Reunion</option>
                                <option value="Romania">Romania</option>
                                <option value="Russian Federation">Russian Federation</option>
                                <option value="Rwanda">Rwanda</option>
                                <option value="Saint Helena">Saint Helena</option>
                                <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
                                <option value="Saint Lucia">Saint Lucia</option>
                                <option value="Saint Pierre and Miquelon">Saint Pierre and Miquelon</option>
                                <option value="Saint Vincent and The Grenadines">Saint Vincent and The Grenadines</option>
                                <option value="Samoa">Samoa</option>
                                <option value="San Marino">San Marino</option>
                                <option value="Sao Tome and Principe">Sao Tome and Principe</option>
                                <option value="Saudi Arabia">Saudi Arabia</option>
                                <option value="Senegal">Senegal</option>
                                <option value="Serbia">Serbia</option>
                                <option value="Seychelles">Seychelles</option>
                                <option value="Sierra Leone">Sierra Leone</option>
                                <option value="Singapore">Singapore</option>
                                <option value="Slovakia">Slovakia</option>
                                <option value="Slovenia">Slovenia</option>
                                <option value="Solomon Islands">Solomon Islands</option>
                                <option value="Somalia">Somalia</option>
                                <option value="South Africa">South Africa</option>
                                <option value="South Georgia and The South Sandwich Islands">South Georgia and The South Sandwich Islands</option>
                                <option value="Spain">Spain</option>
                                <option value="Sri Lanka">Sri Lanka</option>
                                <option value="Sudan">Sudan</option>
                                <option value="Suriname">Suriname</option>
                                <option value="Svalbard and Jan Mayen">Svalbard and Jan Mayen</option>
                                <option value="Swaziland">Swaziland</option>
                                <option value="Sweden">Sweden</option>
                                <option value="Switzerland">Switzerland</option>
                                <option value="Syrian Arab Republic">Syrian Arab Republic</option>
                                <option value="Taiwan, Province of China">Taiwan, Province of China</option>
                                <option value="Tajikistan">Tajikistan</option>
                                <option value="Tanzania, United Republic of">Tanzania, United Republic of</option>
                                <option value="Thailand">Thailand</option>
                                <option value="Timor-leste">Timor-leste</option>
                                <option value="Togo">Togo</option>
                                <option value="Tokelau">Tokelau</option>
                                <option value="Tonga">Tonga</option>
                                <option value="Trinidad and Tobago">Trinidad and Tobago</option>
                                <option value="Tunisia">Tunisia</option>
                                <option value="Turkey">Turkey</option>
                                <option value="Turkmenistan">Turkmenistan</option>
                                <option value="Turks and Caicos Islands">Turks and Caicos Islands</option>
                                <option value="Tuvalu">Tuvalu</option>
                                <option value="Uganda">Uganda</option>
                                <option value="Ukraine">Ukraine</option>
                                <option value="United Arab Emirates">United Arab Emirates</option>
                                <option value="United Kingdom">United Kingdom</option>
                                <option value="United States">United States</option>
                                <option value="United States Minor Outlying Islands">United States Minor Outlying Islands</option>
                                <option value="Uruguay">Uruguay</option>
                                <option value="Uzbekistan">Uzbekistan</option>
                                <option value="Vanuatu">Vanuatu</option>
                                <option value="Venezuela">Venezuela</option>
                                <option value="Viet Nam">Viet Nam</option>
                                <option value="Virgin Islands, British">Virgin Islands, British</option>
                                <option value="Virgin Islands, U.S.">Virgin Islands, U.S.</option>
                                <option value="Wallis and Futuna">Wallis and Futuna</option>
                                <option value="Western Sahara">Western Sahara</option>
                                <option value="Yemen">Yemen</option>
                                <option value="Zambia">Zambia</option>
                                <option value="Zimbabwe">Zimbabwe</option>
                                </select>
                                <span className="focus-input100" data-placeholder="&#xf347;"></span>
                        </div>
                        <div className="wrap-input100 validate-input" data-validate="Enter agreement">
                            <fieldset data-role="controlgroup">
                                <legend>Do you accept the <a target="_blank" href="/terms" title="Opens in a new tab">Terms &amp; Conditions</a> ?</legend>
                                <ul>
                                    <li>
                                        <label htmlFor="yes">Yes</label>
                                        <input 
                                            type="radio" 
                                            name="is_agreement" 
                                            id="yes" 
                                            value='yes' 
                                            checked={this.state.is_agreement === 'yes'} 
                                            onChange={this.onChange}
                                        />
                                    </li>
                                    <li>
                                        <label htmlFor="no">No</label>
                                        <input 
                                            type="radio"
                                            name="is_agreement" 
                                            id="no" 
                                            value='no' 
                                            checked={this.state.is_agreement === 'no'}
                                            onChange={this.onChange}
                                        />
                                    </li>
                                </ul>
                            </fieldset>
                        </div>
                        <div className="captcha-section">
                            <ReCAPTCHA
                                sitekey={_Conf.Google_Recaptcha}
                                onChange={this.verificationCaptcha}
                            />
                        </div>
                        <div className="container-register100-form-btn">
                            <button 
                                type="submit" 
                                disabled={ (!this.state.gender 
                                    || !this.state.first_name 
                                    || !this.state.last_name 
                                    || !this.state.nickname 
                                    || !this.state.email 
                                    || !this.state.password
                                    || (this.state.is_agreement).indexOf('yes') === -1
                                    || !this.state.its_not_bot
                                    || !this.state.birthdate) }
                                    className="register100-form-btn">
                                Register
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
            
        )
    }
}

export default Register;