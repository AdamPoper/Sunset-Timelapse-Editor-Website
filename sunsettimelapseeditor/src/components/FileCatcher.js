import React from "react";
import b64ToBlob from 'b64-to-blob';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Alert} from 'react-bootstrap';
import '../FileCatcher.css';

export default class FileCatcher extends React.Component {
	constructor() {
		super();
		this.state = {
			XMP_files: [],
			algorithmDone: false,
		};
		this.sendXMPfiles = this.sendXMPfiles.bind(this);
	}

	checkIfXMP(filename) {
		let endChar = filename.length - 4;
		let fileType = new String();
		while (endChar < filename.length) {
			fileType += filename.charAt(endChar);
			endChar++;
		}
		if (fileType != ".xmp") {
			console.log(fileType);
			alert("Please only upload .xmp files");
			return false;
		}
		return true;
	}

	componentDidMount() {
		const fileInput = document.getElementById("file-input");
		let totalSizeOfFilesBytes = 0;
		fileInput.addEventListener("change", (e) => {
			this.setState({ XMP_files: [] });
			const files = [];
			for (let i = 0; i < fileInput.files.length; i++) {
				if (this.checkIfXMP(fileInput.files[i].name)) {
					totalSizeOfFilesBytes += fileInput.files[i].size;
					let fr = new FileReader();
					fr.onload = () => {
						const fileName = fileInput.files[i].name;
						const text = fr.result;
						files.push({ name: fileName, data: text });
					};
					fr.readAsText(fileInput.files[i]);
				} else return;
			}
			const sizeOfFilesKB = (totalSizeOfFilesBytes / 1024).toFixed(2);
			const fileNameAndSize = `${fileInput.files.length} XMP Files - ${sizeOfFilesKB}KB`;
			document.querySelector('.file-name').textContent = fileNameAndSize;
			this.setState({ XMP_files: files });
			console.log(this.state.XMP_files);
		});
	}

	async sendXMPfiles() {
		const options = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(this.state.XMP_files),
		};
		await fetch("/api/files-submit", options)
			.then((response) => response.json())
			.then((data) => {
        		this.setState({ XMP_files: data.xmp_data });
        		this.setState({algorithmDone: true});
				console.log(this.state.XMP_files);
			})
			.catch((error) => {
				console.log(error);
				alert('Please Check Your XMP Files');
			});
	}

	async download() {		
		await fetch('/api/download-files')
		.then(res => res.json())
		.then(data => {
			console.log(data);
			const zipBlob = b64ToBlob(data.zip64);
			console.log(zipBlob);
			const fileURL = URL.createObjectURL(zipBlob);
			let anchor = document.createElement('a');
			anchor.href = fileURL;
			anchor.download = 'XMPfiles.zip';
			document.body.appendChild(anchor);
			anchor.click();
			document.body.removeChild(anchor);
			URL.revokeObjectURL(fileURL);
		}).catch(err => {
			console.error(err);
		});		
	}

	render() {
		return (
			<div>
				<form className="file-form">
					<div className="file-input">
						<input type="file" className="file" id="file-input" multiple />
						<label htmlFor='file-input'>
							Select Files
							<p className="file-name">No Files Selected</p>
						</label>
					</div>
					{this.state.algorithmDone ? <p>Calculations Have finished</p> : <div/>}
					<div className="file-submit-download">
						<button
							onClick={(e) => {
								e.preventDefault();
								this.sendXMPfiles();
							}}
							className="btn btn-outline-primary btn-lg">
							Submit
						</button>
						{this.state.algorithmDone ? (
							<button onClick={(e) => {
								e.preventDefault();
								this.download();
							}
							} className="btn btn-outline-primary btn-lg">
								Download Results
							</button>
						) : (
							<div />
						)}
					</div>
				</form>
			</div>
		);
	}
}
