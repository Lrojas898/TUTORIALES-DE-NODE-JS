

//we need to expose this function to the other modules

const sum = (num1, num2) => num1 + num2;

const PI = 3.14;

class SomeMathObject{

    constructor(){

        console.log('object created')
    }


}

//we can export the different attributes by asigning as an attribute
//module.exports.sum = sum;
//module.exports.PI = PI;
//module.exports.SomeMathObject = SomeMathObject;

//or we van then create a specific 'array' where they are exposed everything that we need

module.exports = {sum:sum, PI:PI, SomeMathObject: SomeMathObject}
