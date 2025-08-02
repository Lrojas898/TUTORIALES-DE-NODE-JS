const fs = require('fs');

//module for compressing files
const zlib = require('zlib');

const gzip = zlib.createGzip();


const readStream = fs.createReadStream('examplePipe.txt', 'utf-8');
const writeStream = fs.createWriteStream('examplePipe2.txt.gz', 'utf-8');

readStream.pipe(writeStream);

//for a pipe we need two streams> origin and destination. Read origin and 
//write will be destination 

readStream.pipe(gzip).pipe(writeStream);
