//to event driving programming, we will need to required that module 
const EventEmitter = require('events');
//this event emmiter object will have an event listener attached to it

const eventEmitter = new EventEmitter();

eventEmitter.on('tutorial'   , ()=> {

    console.log('tutorial event has occurred')


});



eventEmitter.on('tutorial'   , (num1, num2)=> {

    console.log('result'+(num1 + num2))


});



// the last function of on will only occur if a tutorial event occur

eventEmitter.emit('tutorial');

//will serve as the arguments for the event emmiter that contemplates a required
//parameters
eventEmitter.emit('tutorial',1,2);

class Person extends EventEmitter{

    constructor(name){

        super();
        this._name = name;



    }


    getName(){

        return this._name;

    }


}


let pedro = new Person('Pedro')

let christina = new Person('Christina');


pedro.on('name', ()=>{
    console.log('my name is:  '+ pedro._name);


})

christina.on('name', ()=>{
    console.log('my name is:  '+ christina._name);


})


//the event get executed syncrhonously, that means at the same time. 
//and in the order that they have been called


pedro.emit('name')


christina.emit('name')





const tutorial = require('./tutorial') // all modules need to be imported, this infers that it requires the module
//tutorial and all the functions that are exported, all exposed will be open to use, so
//no need on specifying each aspect or function exposed. 

console.log(tutorial);

//the function is called normally, with no problems at all

//as tutorial does not expose only a function, we then need to specifiy
//what are we trying to expose
//console.log(tutorial(1,1))

console.log(tutorial.sum(1,1))
console.log(tutorial.PI)



//Modules are basically a java script file, 
//each file can and will have a especific concern that can be used from
//others files

console.log("Hello World from NodeJs");
