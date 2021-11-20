const mid1= function(req, res, next){
    console.log('this is a basic middleware my 1st api')
    next()
}

const mid2= function(req, res, next){
    console.log('this is a basic middleware my 2nd api')
    next()
}

const mid3= function(req, res, next){
    console.log('this is a basic middleware my 3rd api')
    next()
}

const mid4= function(req, res, next){
    console.log('this is a basic middleware my 4th api')
    next()
}

module.exports.mid1=mid1
module.exports.mid2=mid2
module.exports.mid3=mid3
module.exports.mid4=mid4