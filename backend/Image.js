const fs = require('fs');

class Image {
    constructor(xmp_data) {
        this.f_stop = 0;
        this.shutterspeed = 0;
        this.iso = 0;
        this.xmp_text = xmp_data.data;
        this.xmp_file = null;
        this.filename = xmp_data.name;

        const s_exposureSubStr = 'Exposure2012';
        const s_aperatureSubStr = 'Fnumber';
        const s_shutterspeedSubStr = 'ExposureTime';
        const s_isoSubStr = 'RecommendedExposureIndex';
    
        this.writeToFile();
        this.calcExposureVariables();
    }

    writeToFile() {
        fs.writeFile('public/xmp_files/'+this.filename, this.xmp_text, (err) => {
            if (err) throw err;
        });
    }

    calcExposureVariables() {

    }
}

module.exports = Image;