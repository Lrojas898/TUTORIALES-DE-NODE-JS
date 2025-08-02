const http = require('http');
const fs = require('fs');

http.createServer((req, res)=>{

    //for each type we must specify the name and also the type
    const readStream = fs.createReadStream('./static/index.html');
    res.writeHead(200, {'content-type': 'text/html'});
    readStream.pipe(res);

}).listen(3000);