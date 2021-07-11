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
app.use(express.json({limit: '50mb'}));
app.use(express.static('public'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});

app.get('/api', (request, response) => {
    console.log('server contacted');    
    response.json({message: 'hello'});
});

app.post('/api/files-submit', (request, response) => {
    //console.log(request.body);
    calculateExposureOffsets(request.body);
    response.json({message: 'xmp_files recieved'});
});

function calculateExposureOffsets(xmp_files) {
    const images = [];
    xmp_files.forEach(xmp_data => {
        images.push(new Image(xmp_data));
    });
    
}