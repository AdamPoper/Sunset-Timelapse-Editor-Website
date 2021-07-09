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

  componentDidMount() {
    this.init();       
    const fileInput = document.getElementById('file-input');
    fileInput.addEventListener('change', (e) => {
      this.setState({XMP_files: []});
      const files = [];
      for(let i = 0; i < fileInput.files.length; i++) {
        files.push(fileInput.files[i]);
      }
      this.setState({XMP_files: files});
      console.log(this.state.XMP_files);
    });
  }

  async sendXMPfiles() {
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(this.state.XMP_files)
    }
    await fetch('/api/file-submit', options).then(response => {
      console.log(response);
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
