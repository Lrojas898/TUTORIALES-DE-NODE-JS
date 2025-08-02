const express = require('express');
const path = require('path');
const app = express();
//use a middelware: software that acts as a bridge, 
//enabling communication and data management between 
// different applications, databases, and systems. Creates a
//virutal http routes withouth changing the name of the directory
app.use('/public', express.static(path.join(__dirname, 'static')));
app.get('/', (req,res)=>{  

    //solo se puede enviar una respuesta por peticion
    res.sendFile(path.join(__dirname,'static','index.html'));

});

app.listen(3000);