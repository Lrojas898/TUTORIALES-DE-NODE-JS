const http = require('http');

//Request Object: something that clients wants
//Response Object: our response to that specific object


const server = http.createServer((req, res) =>{

    if(req.url === '/'){

         //we have here defined the answer
    res.write('Hello world from server of Node Js');
    //we have here sent the answer
    res.end();


    }else{


        res.write('using some other domain');
        res.end();
    }

   
    

});

server.listen('3000');