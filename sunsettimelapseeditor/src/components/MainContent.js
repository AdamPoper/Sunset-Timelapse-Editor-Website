import React from 'react';
import FileCatcher from './FileCatcher.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import sunset from '../assets/sunset.jpg';
import before from '../assets/before.mp4';
import after from '../assets/after.mp4';
import lr from '../assets/lr.png';
import ps from '../assets/ps.png';
import Nav from './Nav.js';
import AppInfoPage from './AppInfoPage.js';
import {Route} from 'react-router-dom';
import '../MainContent.css';

export default class MainContent extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    componentDidMount() {

    }
    render() {
        return (
            <div className='App-header'>   
                <Nav />   
                <h1>Welcome To The Lightroom Sunset Time Lapse Editor</h1>
                <div className="adobe-images">
                  <img src={lr} alt="Adobe Lightroom"/>
                  <img src={ps} alt="Adobe Photoshop"/>
                </div>
                <div className="intro-img-message">
                  <h3 className="intro-message">Easily Get Exposure Offsets For Your Time Lapse Images To Eliminate Light Flickering</h3> 
                  <img src={sunset} alt="Sunset Time Lapse Editing"/>        
                </div>
                <h2>See The Before And After</h2>
                <div className="videos">
                  <video src={before} muted loop autoPlay alt="sunset time lapse with light flickering"/>
                  <video src={after} muted loop autoPlay alt="sunset time lapse with out light flickering"/>
                </div>
                <h3>Select All Of Your Adobe XMP Files For The Images</h3>
                <h3>You Wish To Use In Your Time Lapse And Upload Them</h3>      
                <FileCatcher />
            </div>
        );
    }
}