import React, { Component } from 'react';
import _Conf from '../../configs/global.js';

import './Footer.css';

class Footer extends Component {
    render() {
        return (
            <div className="footer">
                <footer className="page-footer font-small blue">
                    <div className="footer-copyright text-center py-3"><p>{_Conf.Footer._p}
                        <a href="#example"> {_Conf.Footer._a}</a></p>
                    </div>
                </footer>
            </div>
        )
    }
}

export default Footer;