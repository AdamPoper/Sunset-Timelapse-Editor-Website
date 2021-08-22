class Image {

    static EXPOSURE_SUB_STR = "Exposure2012";   
    static APERTURE_SUB_STR = "FNumber";
    static SHUTTER_SPEED_SUB_STR = "ExposureTime";
    static ISO_SUB_STR = "RecommendedExposureIndex";

	constructor(xmpData) {        

        // for calculating the exposure differences, each image has an aperture, shutter speed, and iso
		this.fstop = -1;
		this.shutterspeed = -1;
		this.iso = -1;

        // the contents of the xmp text as a string
		this.xmpText = xmpData.data;

        // the content of the xmp text as an array, one element for one file line
		this.xmpFileLines = [];

        // name of the file
		this.filename = xmpData.name;		
        
		this.xmpFileLines = this.xmpText.split("\n");
        this.parseExposureValues();                
	}

    // takes a value in stops for how much of an exposure offset to add to each image
    updateExposureMetaData(stops) {
        for(let i = 0; i < this.xmpFileLines.length; i++) {
            if(this.xmpFileLines[i].includes(Image.EXPOSURE_SUB_STR)) {
                let line = this.xmpFileLines[i];
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
                this.xmpFileLines[i] = updatedLine;
                break;
            }
        }
    }

    // linearly searches the xmpFileLines array for the lines that contain the substrings that denote
    // which exposure value they contain.
	parseExposureValues() {
        let done = false; // stops if all the exposure values have been found
		for (let i = 0; i < this.xmpFileLines.length && !done; i++) {
            const line = this.xmpFileLines[i];
			if (this.xmpFileLines[i].includes(Image.APERTURE_SUB_STR)) {
				this.fstop = this.parseShutterspeedOrFstop(line);
				continue;
			}
			if (this.xmpFileLines[i].includes(Image.ISO_SUB_STR)) {
				this.iso = this.parseISO(line);
				continue;
			}
			if (this.xmpFileLines[i].includes(Image.SHUTTER_SPEED_SUB_STR)) {
				this.shutterspeed = this.parseShutterspeedOrFstop(line);
				continue;
            }
            done = this.fstop != -1 && this.iso != -1 && this.shutterspeed != -1;
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

    // finalizes how the actual file will be layed out 
    finalizeResults() {
        let finalFile = '';
        this.xmpFileLines.forEach(line => {           
            finalFile += line + '\n';
        });
        this.xmpText = finalFile;
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
        if(img1.fstop != -1 && img2.fstop != -1 && img1.fstop != img2.fstop) {
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
		return Math.log(img1.fstop / img2.fstop) / Math.log(Math.sqrt(2));
	}
}

module.exports = Image;