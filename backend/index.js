const express = require('express');
const bodyparser = require('body-parser');

const app = express();

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

app.use(bodyparser.json({limit: '50mb'}));
app.use(express.json({limit: '50mb'}));
app.use(express.static('public'));
/*
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});
*/
app.get('/api', (request, response) => {
    console.log('server contacted');    
    response.json({message: 'hello'});
});

app.post('/api/file-submit', (request, response) => {
    console.log(request.body.XMP_files);
    response.json({message: 'xmp_files recieved'});
});