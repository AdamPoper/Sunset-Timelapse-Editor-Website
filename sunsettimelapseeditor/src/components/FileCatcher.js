import React from "react";

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
		await fetch("/api")
			.then((response) => response.json())
			.then((data) => console.log(data))
			.catch((err) => console.error(err));
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
				const xmp_data = data.xmp_data;
				// //console.log(xmp_data);
				// const files = [];
				// xmp_data.forEach(xmp => {
				//   files.push(new File([xmp.xmp_text], xmp.name, {
				//     type: ''
				//   }));
				// });

				// this.setState({XMP_files: files});
        this.setState({ XMP_files: xmp_data });
        this.setState({algorithmDone: true});
				console.log(this.state.XMP_files);
			})
			.catch((error) => {
				console.log(error);
			});
	}

	download(file) {
		let a = document.createElement("a");
		a.setAttribute(
			"href",
			"data:text/plain;charset=utf-8," + encodeURIComponent(file.xmp_text)
		);
		a.setAttribute("download", file.name);
		a.style.display = "none";
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
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
						<button onClick={() => this.download(this.state.XMP_files[123])}>
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
