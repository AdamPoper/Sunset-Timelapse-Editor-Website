const express = require('express');
const bodyparser = require('body-parser');
const readline = require('readline');
const Image = require('./Image.js');
const fs = require('fs');

const app = express();

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

app.use(bodyparser.json({limit: '50mb'}));
app.use(express.json());
app.use(express.static('public'));

// cause CORS is so fucking stupid
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});

// debugging only
app.get('/api', (request, response) => {
    console.log('server contacted');    
    response.json({message: 'hello'});
});

// submit all the xmp files to the server 
app.post('/api/files-submit', (request, response) => {
    //console.log(request.body);
    const files = calculateExposureOffsets(request.body);    
    response.json({xmp_data: files});
});

// calculates what all the exposure offsets for each image need to be
function calculateExposureOffsets(xmp_files) {
    const files = [];
    const images = [];
    xmp_files.forEach(xmp_data => {
        images.push(new Image(xmp_data));
    });
    let lastSequenceUpdated = 0;
    for(let i = 0; i < images.length - 1; i++) {
        const stops = Image.compareImages(images[i], images[i + 1]);
        console.log('Stops: ' + stops);
        if (stops != 0) {
            const exposureIncrement = stops / (i - lastSequenceUpdated);
            let exposure = 0;
            for (let j = lastSequenceUpdated; j <= i; j++) {
                images[j].updateExposureMetaData(exposure);
                images[j].finalizeResults();
                files.push(
                    {
                        name: images[j].filename,
                        xmp_text: images[j].xmp_text
                    }
                );
                exposure += exposureIncrement;
            }
            lastSequenceUpdated = i + 1;
        }
    }

    // if there are images left then they need to be updated too
    // 0.04 is used as a default
    if(lastSequenceUpdated <= images.length) {
        const exposureIncrement = 0.04;
        let exposure = 0;
        for(let i = lastSequenceUpdated; i < images.length; i++) {
            images[i].updateExposureMetaData(exposure);
            images[i].finalizeResults();
            files.push(
                {
                    name: images[i].filename,
                    xmp_text: images[i].xmp_text
                }
            );
            exposure += exposureIncrement;
        }

    }    

    return files;
}