const fs = require("fs");
const readline = require("readline");

class Image {
    static EXPOSURE_SUB_STR = "Exposure2012";   
    static APERTURE_SUB_STR = "FNumber";
    static SHUTTER_SPEED_SUB_STR = "ExposureTime";
    static ISO_SUB_STR = "RecommendedExposureIndex";

	constructor(xmp_data) {
		this.f_stop = -1;
		this.shutterspeed = -1;
		this.iso = -1;
		this.xmp_text = xmp_data.data;
		this.xmp_fileLines = [];
		this.filename = xmp_data.name;

		// i would make these static but node js is having none of it
		//this.exposureSubStr = "Exposure2012";
		// this.aperatureSubStr = "FNumber";
		// this.shutterspeedSubStr = "ExposureTime";
		// this.isoSubStr = "RecommendedExposureIndex";
        
		this.xmp_fileLines = this.xmp_text.split("\n");
		//console.log('Size: ' + this.xmp_fileLines.length);
        this.parseExposureValues();                
	}

    updateExposureMetaData(stops) {
        //console.log(this.xmp_fileLines.length);
        for(let i = 0; i < this.xmp_fileLines.length; i++) {
            if(this.xmp_fileLines[i].includes(Image.EXPOSURE_SUB_STR)) {
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
                this.xmp_fileLines[i] = updatedLine;
                //console.log(this.filename + ': ' + this.xmp_fileLines[j]);
                break;
            }
        }
    }

    // linearly searches the xmp_fileLines array for the lines that contain the substrings that denote
    // which exposure value they contain.
	parseExposureValues() {
        let done = false; // stops if all the exposure values have been found
		for (let i = 0; i < this.xmp_fileLines.length && !done; i++) {
            const line = this.xmp_fileLines[i];
			if (this.xmp_fileLines[i].includes(Image.APERTURE_SUB_STR)) {
				this.f_stop = this.parseShutterspeedOrFstop(line);
				continue;
			}
			if (this.xmp_fileLines[i].includes(Image.ISO_SUB_STR)) {
				this.iso = this.parseISO(line);
				continue;
			}
			if (this.xmp_fileLines[i].includes(Image.SHUTTER_SPEED_SUB_STR)) {
				this.shutterspeed = this.parseShutterspeedOrFstop(line);
				continue;
            }
            done = this.f_stop != -1 && this.iso != -1 && this.shutterspeed != -1;
        }
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

    // the parsing algorithm for aperture and shutterspeed is the same
	parseShutterspeedOrFstop(line) {
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
        this.xmp_text = finalFile;
    }

    // compare the difference in stops between 2 images and return the result
    static compareImages(img1, img2) {
        let stops = 0;
        if(img1.iso != -1 && img2.iso != -1 && img1.iso != img2.iso) {
            stops += this.calculateISOexposure(img1, img2);
        }
        if(img1.shutterspeed != -1 && img2.shutterspeed != -1 && img1.shutterspeed != img2.shutterspeed) {
            stops += this.calculateShutterSpeedExposure(img1, img2);
        }
        if(img1.f_stop != -1 && img2.f_stop != -1 && img1.f_stop != img2.f_stop) {
            stops += this.calculateFStopExposure(img1, img2);
        }
        return stops;
    }

    // calculates and returns the ISO exposure difference in stops between 2 images
	static calculateISOexposure(img1, img2) {
		return Math.log(img2.iso / img1.iso) / Math.log(2);
	}

    // calculates and returns the shutterspeed exposure difference in stops between 2 images
	static calculateShutterSpeedExposure(img1, img2) {
		return Math.log(img2.shutterspeed / img1.shutterspeed) / Math.log(2);
	}

    // calculates and returns the aperature exposure difference in stops between 2 images
	static calculateFStopExposure(img1, img2) {
		return Math.log(img1.f_stop / img2.f_stop) / Math.log(Math.sqrt(2));
	}
}

module.exports = Image;