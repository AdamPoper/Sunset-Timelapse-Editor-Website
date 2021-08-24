const express = require('express');
const Image = require('./Image.js');
const JSZip = require('jszip');
const session = require('express-session');
const path = require('path');

const app = express();

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

app.use(express.json({limit: '50mb'}));
app.use(express.static('public'));

// cause CORS is so fucking stupid
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});

app.use(session({
    saveUninitialized: false,
    resave: false,
    secret: 'secret'
}));

// debugging only
app.get('/api', (request, response) => {
    console.log('server contacted');    
    response.json({message: 'hello'});
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public'));
})

// submit all the xmp files to the server 
app.post('/api/files-submit', (request, response) => {
    if(!request.session.xmpData) {
        // a list of the filename and the updated xmp text with the exposure calculations
        request.session.xmpData = [];
    }
    try {
        request.session.xmpData = calculateExposureOffsets(request.body);  
    } catch(e) {                
        throw new Error(e);
    }
    response.json({xmp_data: request.session.xmpData});
});

// download the results of the calculations
// generates a zip file to place all of the files
app.get('/api/download-files', async (request, response) => {
    const zipBase64 = await generateZipFile(request.session.xmpData);
    response.json({
        zip64: zipBase64
    });
});

// generates the actual zip file and returns it as base64 
async function generateZipFile(xmpData) {
    const zip = new JSZip();
    xmpData.forEach(({name, xmp_text}) => {
        zip.file(name, xmp_text);        
    });
    const zipBase64 = await zip.generateAsync({type: 'base64'});    
    return zipBase64;
}

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
    // 0.04 is used as default
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