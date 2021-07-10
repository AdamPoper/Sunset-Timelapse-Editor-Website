import React from "react";

export default class FileCatcher extends React.Component {
  constructor() {
    super();
    this.state = {
      XMP_files: [],
    };
    this.sendXMPfiles = this.sendXMPfiles.bind(this); 
    this.init = this.init.bind(this);   
  }

  async init() {
    await fetch('/api')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(err => console.error(err));
  }

  checkIfXMP(filename) {
    let endChar = filename.length - 4;
    let fileType = new String();
    while(endChar < filename.length) {
      fileType += filename.charAt(endChar);
      endChar++;
    }
    if(fileType != '.xmp') {
      console.log(fileType);
      alert('Please only upload .xmp files');
      return false;
    }
    return true;
  }

  componentDidMount() {
    this.init();       
    const fileInput = document.getElementById('file-input');
    fileInput.addEventListener('change', (e) => {
      this.setState({XMP_files: []});
      const files = [];
      for(let i = 0; i < fileInput.files.length; i++) {
        if(this.checkIfXMP(fileInput.files[i].name)) {
          let fr = new FileReader();
          fr.onload = () => {
            const fileName = fileInput.files[i].name;
            const text = fr.result;
            files.push({name: fileName, data: text});
          }          
          fr.readAsText(fileInput.files[i]);
        }
        else return;
      }
      this.setState({XMP_files: files});
      console.log(this.state.XMP_files);
    });
  }

  async sendXMPfiles() {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state.XMP_files)
    }
    await fetch('/api/files-submit', options).then(response => {
      console.log(response.json());
    }).catch(error => {console.log(error)});
  }

  render() {
    return (
      <div>
        <form>
          <label>Upload XMP Files </label>
          <input type="file" id='file-input' multiple />
          <button onClick={(e) => {
            e.preventDefault();
            this.sendXMPfiles();            
          }}>Submit</button>          
        </form>
      </div>
    );
  }
}
