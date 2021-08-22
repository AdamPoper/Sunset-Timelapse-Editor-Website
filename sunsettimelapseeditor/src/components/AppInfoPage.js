import React from 'react';
import Nav from './Nav.js';
import '../Appinfo.css';
import meta from '../assets/meta.PNG';
import me from '../assets/me.png';

function AppInfoPage() {
    return(
        <div className="app-info">
            <Nav />
            <h1>How To Use This App</h1>
            <p>
                This app uses Adobe XMP Files to edit the metadata of your 
                images. By using manual exposure changes found in the XMP files, the app can
                calculate how much exposure offset needs to be added to each image.
                Learn more about XMP files <a href="https://helpx.adobe.com/lightroom-classic/help/metadata-basics-actions.html" target="_blank">here</a>. 
                To get these files, select all images in Lightroom that are being used for the
                time lapse, right click on a photo, and select metadata, save metadata to files.                 
            </p>
            <img src={meta} alt="Lightroom xmp metadata" className="lr-instructions"/>
            <p>
                First, edit your photos to make them look the way you want them.
                This app will not work with out edited images.
                Once the metadata has been exported, find them in the same file location as 
                your images and upload all of them to the server for processing. 
                Click the submit button to submit them to the server. Once the calculations
                have been completed, click the download button to download the new files as a zip file.                 
            </p>
            <h1>About The Creator</h1>
            <img src={me} className="profile-pic" />
            <p>
                My name is Adam Poper and I am a computer science student at Slippery Rock University of Pennsylvania.
                Computer programming is one of my favorite hobbies. I really enjoy learning and figuring 
                out how things work. It is my goal to one day become a software engineer which is why I  
                have created this app to add to my portfolio of programming projects. 
                Please also view my online portfolio <a href="http://adampoper.io" target="_blank">adampoper.io</a> and
                you can to reach out to me personally at adampoper@gmail.com.
            </p>           
        </div>
    );
}

export default AppInfoPage;