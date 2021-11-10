const obj = require("./logger")
const obj1 = require('./util/helper')
const obj2 = require('../validator/formatter')
const lod = require('lodash')

function mainfunction(){
    console.log("this is my amin function")
}
obj.log('rahul')
obj.welcome()
console.log('this is endpoint url sys:'+obj.endpoint)
console.log('-------------------')
obj1.printDate()
obj1.printMonth()
obj1.batchInfo()
console.log('-------------------')
obj2.Trim()
obj2.lowerCase()
obj2.upperCase()
console.log(lod.chunk(['jan','fab','march','april','may','june','july','Aug','sep','oct','nov','dec'],3));
console.log(lod.tail([1,2,3,4,5,6,7,8,9,10],9));
console.log(lod.union([1,2],[3,4,2],[5,6,7,1],[8,9,11],[4,12,13]));
console.log(lod.fromPairs([['Rahul',1],['Kumar',2],['Shaw',3]]));