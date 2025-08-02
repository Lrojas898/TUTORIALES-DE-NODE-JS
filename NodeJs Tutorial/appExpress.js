const express = require('express');
const app = express();

app.get('/', (req, res)=>{res.send('Hello world using express')}   );


app.get('/example', (req, res)=>{res.send('Hitting example Route')}   );


app.get('/example/:name/:age', (req, res)=>{

    req.params;

    //route parameters are when we must have that data

    console.log(req.params);

    //optional settings will be a query parameters
    
    console.log(req.query)

    res.send('Hitting example Route with Params: '+`${req.params.name}`+' '+`${req.params.age}`)}
   

);

app.listen(3000);

