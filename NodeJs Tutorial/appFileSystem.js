const fs = require('fs');

//Remember> callbacks are functions, for make it more
//directly are defined as arrow functions there, 
//but can alse be defined outside the parameters

fs.writeFile('example.txt', 'this is an example', (err)=>{

    if(err){

        console.log('error'+err);

    }else{
        //we need to specifiy the coding type that we want to be written
        console.log('File succesfully created!');
        fs.readFile('example.txt','utf-8' ,(err, file)=>{

            if(err){
                console.log(err)
            }else{console.log(file)}

        })
    }

})


//fs.rename('example.txt','example2.txt',(err)=>{if(err){console.log(err)}else{console.log('succesfully renamed');}});

fs.appendFile('example.txt', 'More data to append', (err)=>{
    
    if(err){

        console.log(err);

    }else{

        console.log('Data correctly appended');
    }
    
    
    } )


fs.unlink('example.txt', (err)=> {

    if(err){
        console.log(err);
    }else{

        console.log('succesfully delete the file!')
    }



})






