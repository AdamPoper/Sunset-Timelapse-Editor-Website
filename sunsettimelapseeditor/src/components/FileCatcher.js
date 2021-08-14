import React from "react";
import b64ToBlob from 'b64-to-blob';

export default class FileCatcher extends React.Component {
	constructor() {
		super();
		this.state = {
			XMP_files: [],
			algorithmDone: false,
		};
		this.sendXMPfiles = this.sendXMPfiles.bind(this);
		this.init = this.init.bind(this);
	}

	async init() {
		
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
		this.init();
		const fileInput = document.getElementById("file-input");
		fileInput.addEventListener("change", (e) => {
			this.setState({ XMP_files: [] });
			const files = [];
			for (let i = 0; i < fileInput.files.length; i++) {
				if (this.checkIfXMP(fileInput.files[i].name)) {
					let fr = new FileReader();
					fr.onload = () => {
						const fileName = fileInput.files[i].name;
						const text = fr.result;
						files.push({ name: fileName, data: text });
					};
					fr.readAsText(fileInput.files[i]);
				} else return;
			}
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
			});
	}

	async download() {
		// const res = await fetch('/api/download-files');
		// const data = await res.json();
		// console.log(data);
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
		// const file = await fetch('/api/download-files');
		// const fileBlob = await file.blob();
		// const fileUrl = URL.createObjectURL(fileBlob);		
		// let a = document.createElement("a");
		// a.href = fileUrl;
		// a.download = 'XMPfiles.xmp';
		// document.body.appendChild(a);
		// a.click();
		// document.body.removeChild(a);	
		// URL.revokeObjectURL(fileUrl);
		// a.setAttribute(
		// 	"href",
		// 	"data:text/plain;charset=utf-8," + encodeURIComponent(file.xmp_text)
		// );
		// a.setAttribute("download", file.name);
		// a.style.display = "none";
		// document.body.appendChild(a);
		// a.click();
		// document.body.removeChild(a);
		
	}

	render() {
		return (
			<div>
				<form>
					<label>Upload XMP Files </label>
					<input type="file" id="file-input" multiple />
					<button
						onClick={(e) => {
							e.preventDefault();
							this.sendXMPfiles();
						}}
					>
						Submit
					</button>
					{this.state.algorithmDone ? (
						<button onClick={(e) => {
							e.preventDefault();
							this.download();
						}
						}>
							Download Results
						</button>
					) : (
						<div />
					)}
				</form>
			</div>
		);
	}
}
