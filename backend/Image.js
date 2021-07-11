const fs = require('fs');
const readline = require('readline');

class Image {
    constructor(xmp_data) {
        this.f_stop = 0;
        this.shutterspeed = 0;
        this.iso = 0;
        this.xmp_text = xmp_data.data;
        this.xmp_fileLines = [];
        this.filename = xmp_data.name;

        const s_exposureSubStr = 'Exposure2012';
        const s_aperatureSubStr = 'Fnumber';
        const s_shutterspeedSubStr = 'ExposureTime';
        const s_isoSubStr = 'RecommendedExposureIndex';            
        
        fs.writeFile('public/xmp_files/'+this.filename, this.xmp_text, (err) => {
            if (err) throw err;
        });

        const file = readline.createInterface({
            input: fs.createReadStream('public/xmp_files/'+this.filename),
            output: process.stdout,
            terminal: false
        });

        file.on('line', line => {
            //console.log(line);
            this.xmp_fileLines.push(new String(line));
        });        
        
        console.log('Size: ' + this.xmp_fileLines.length);
    }

    static calculateISOexposure(img1, img2) {
        return (Math.log(img2.iso / img1.iso) / Math.log(2));
    }

    static calculateShutterSpeedExposure(img1, img2) {
        return (Math.log(img2.shutterspeed / img1.shutterspeed) / Math.log(2));
    }

    static calculateFStopExposure(img1, img2) {
        return (Math.log(img2.f_stop / img1.f_stop) / Math.log(Math.sqrt(2)));
    }
}

module.exports = Image;