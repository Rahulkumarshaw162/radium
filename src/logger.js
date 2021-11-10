function log(name){
    console.log(name)
}
function welcome(){
    console.log('welcome in my first logger. i am rahul')
}
const url = 'https:\\www.google.com'

module.exports.log = log
module.exports.welcome =  welcome
module.exports.endpoint = url