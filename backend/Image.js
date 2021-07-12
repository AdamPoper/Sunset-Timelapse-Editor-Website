const fs = require("fs");
const readline = require("readline");

class Image {
	constructor(xmp_data) {
		this.f_stop = 0;
		this.shutterspeed = 0;
		this.iso = 0;
		this.xmp_text = xmp_data.data;
		this.xmp_fileLines = [];
		this.filename = xmp_data.name;

		// i would make these static but node js is having none of it
		this.exposureSubStr = "Exposure2012";
		this.aperatureSubStr = "FNumber";
		this.shutterspeedSubStr = "ExposureTime";
		this.isoSubStr = "RecommendedExposureIndex";

        
		this.xmp_fileLines = this.xmp_text.split("\n");
		//console.log('Size: ' + this.xmp_fileLines.length);
        this.parseExposureValues();
        
        // fs.writeFile("public/xmp_files/" + this.filename, this.xmp_text, (err) => {
        //     if (err) throw err;
        // });
		// const file = readline.createInterface({
            //     input: fs.createReadStream('public/xmp_files/'+this.filename),
		//     output: process.stdout,
		//     terminal: false
		// });

		// file.on('line', line => {
		//     //console.log(line);
		//     this.xmp_fileLines.push(new String(line));
		// });

		// console.log('Size: ' + this.xmp_fileLines.length);
	}

    updateExposureMetaData(stops) {
        for(let i = 0; i < this.xmp_fileLines.length; i++) {
            if(this.xmp_fileLines[i].includes(this.exposureSubStr)) {
                let line = this.xmp_fileLines[i];
                let updatedLine = '';
                let j = 0;
                while(line.charAt(j) != '"') {
                    updatedLine += line.charAt(j);
                    j++;
                }            
                updatedLine += '"';
                const sign = stops > 0 ? '+' : '';
                updatedLine += sign;
                updatedLine += String(stops);
                updatedLine += '"';
                this.xmp_fileLines[j] = updatedLine;
                console.log(this.filename + ': ' + this.xmp_fileLines[j]);
                break;
            }
        }
    }

    // linearlly searches the xmp_fileLines array for the lines that contain the substrings that denote
    // which exposure value they contain.
	parseExposureValues() {
        let done = false;
		for (let i = 0; i < this.xmp_fileLines.length || !done; i++) {
            const line = this.xmp_fileLines[i];
			if (this.xmp_fileLines[i].includes(this.aperatureSubStr)) {
				this.f_stop = this.parseShutterspeedOrF_stop(line);
				continue;
			}
			if (this.xmp_fileLines[i].includes(this.isoSubStr)) {
				this.iso = this.parseISO(line);
				continue;
			}
			if (this.xmp_fileLines[i].includes(this.shutterspeedSubStr)) {
				this.shutterspeed = this.parseShutterspeedOrF_stop(line);
				continue;
            }
            done = this.f_stop != 0 && this.iso != 0 && this.shutterspeed != 0;
        }
        //console.log(`ISO: ${this.iso}, Shutter Speed: ${this.shutterspeed}, F Stop: ${this.f_stop}`);
	}

    // parse the iso from the file
	parseISO(line) {
        let iso = '';
        let i = 0;
        while(line.charAt(i) != '"') i++;
        i++;
        while(line.charAt(i) != '"') {
            iso += line.charAt(i);
            i++;
        }
        return parseFloat(iso);
    }

    // the parseing algorithm for aperature and shutterspeed is the same
	parseShutterspeedOrF_stop(line) {
        let numerator = "";
		let denominator = "";
		let i = 0;
		while (line.charAt(i) != '"') i++;
		i++;
		while (line.charAt(i) != "/") {
			numerator += line.charAt(i);
			i++;
		}
		i++;
		while (line.charAt(i) != '"') {
			denominator += line.charAt(i);
			i++;
		}		
		return parseFloat(numerator) / parseFloat(denominator);
    }	

    finalizeResults() {
        let finalFile = '';
        this.xmp_fileLines.forEach(line => {
            finalFile += line + '\n';
        });
        console.log(finalFile); 
        this.xmp_text = finalFile;
    }

    // compare the difference in stops between 2 images and return the result
    static compareImages(img1, img2) {
        let stops = 0;
        if(img1.iso != img2.iso) {
            stops += this.calculateISOexposure(img1, img2);
        }
        if(img1.shutterspeed != img2.shutterspeed) {
            stops += this.calculateShutterSpeedExposure(img1, img2);
        }
        if(img1.f_stop != img2.f_stop) {
            stops += this.calculateFStopExposure(img1, img2);
        }
        return stops;
    }

    // calculates and returns the ISO exposure difference in stops between 2 images
	static calculateISOexposure(img1, img2) {
		return Math.log(img2.iso / img1.iso) / Math.log(2);
	}

    // calculates and returns the shutterspeedexposure difference in stops between 2 images
	static calculateShutterSpeedExposure(img1, img2) {
		return Math.log(img2.shutterspeed / img1.shutterspeed) / Math.log(2);
	}

    // calculates and returns the aperature exposure difference in stops between 2 images
	static calculateFStopExposure(img1, img2) {
		return Math.log(img1.f_stop / img2.f_stop) / Math.log(Math.sqrt(2));
	}
}

module.exports = Image;
