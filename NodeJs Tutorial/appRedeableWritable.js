const fs = require('fs');
const readStream = fs.createReadStream('exampleReadbleWriteable.txt', 'utf-8');
const writeStream = fs.createWriteStream('exampleReadbleWriteable2.txt', 'utf-8');

readStream.on('data', (chunk)=>{
    //Data will be loaded in chunks not the whole file directly
    console.log(chunk);
    writeStream.write(chunk);

}   );


//ReadFIle uses a full buffer, meaning that there will be files that
//will not be able to be open or to write all files, as it will be needing
//a lot of avaiable memory to do so. 





