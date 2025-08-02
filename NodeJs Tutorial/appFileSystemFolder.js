const { ifError } = require('assert')
const fs = require('fs')

fs.mkdir('tutorial', (err)=>{

    if(err){
        console.log(err);
    }else{
        fs.writeFile('./tutorial/example.txt','example inside a folder', 

            (err)=>{

                if(err){
                    console.log(err)
                }else{
                    console.log('File created succesfully!')
                }

            }




        )
        console.log('folder succesfully created!');
    }

})





//If a use a remove function, must be in an empty directory, if not it will
//print an error. Use unlink to delete a file inside a folder

// fs.rmdir('tutorial', (err)=>{

//     if(err){
//         console.log(err);
//     }else{
    
//         console.log('folder succesfully deleted!');
//     }


// })


//Readdir solo funciona en folders -directorios- y sirve para leer
//el contenido que tine dentro> lista todos los archivos en un array
//con el nombre de todos estos

let filesInTutorials = fs.readdir('./tutorial', (err, files) => {

    if(err)
        console.log(err)
    else
        console.log('Your files'+files)


});








