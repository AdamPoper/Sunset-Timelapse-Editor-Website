import React from 'react';
import {BrowserRouter as Router, Route, Switch, Link} from 'react-router-dom';
import '../Nav.css';

export default class Nav extends React.Component {
    constructor() {
        super();
        this.state = {};        
    }
    componentDidMount() {

    }
    render() {
        return(
            <div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/home" className="link">Home</Link>
                        </li>
                        <li>
                            <Link to="/appinfo" className="link">About This App</Link>
                        </li>
                    </ul>
                </nav>
            </div>
        );
    }
}