import './App.css';
import FileCatcher from './components/FileCatcher.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Alert} from 'react-bootstrap';
import sunset from './assets/sunset.jpg';
import before from './assets/before.mp4';
import after from './assets/after.mp4';
import lr from './assets/lr.png';
import lrc from './assets/lrc.png';
import ps from './assets/ps.png';

function App() {
  return (
    <div className='App-header'>
      <h1>Welcome To The Lightroom Sunset Time Lapse Editor</h1>
      <div className="adobe-images">
        <img src={lr}/>
        <img src={ps}/>
      </div>
      <div className="intro-img-message">
        <h3 className="intro-message">Easily Get Exposure Offsets For Your Time Lapse Images To Eliminate Light Flickering</h3> 
        <img src={sunset} />        
      </div>
      <h2>See The Before And After</h2>
      <div className="videos">
        <video src={before} muted loop autoPlay/>
        <video src={after} muted loop autoPlay/>
      </div>
      <h3>Select All Of Your Adobe XMP Files For The Images</h3>
      <h3>You Wish To Use In Your Time Lapse And Upload Them</h3>      
      <FileCatcher />
    </div>
  );
}

export default App;