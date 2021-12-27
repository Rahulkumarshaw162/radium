const jwt = require('jsonwebtoken')

//-----------------------------------------------------------------------------//

const checkLogin = async function (req, res, next) {
    try {
        let token = req.header('Authorization', 'Bearer Token')//-----//request handling of invalid token
        // console.log (token)
        if (!token) {
            return res.status(400).send({ status: false, message: 'You are not logged in, Please login to proceed your request' })
        }
        let splitToken = token.split(' ')
        // console.log (splitToken)
        let decodedToken = jwt.verify(splitToken[1], 'group5')
        // console.log (decodedToken.userId)
        if (decodedToken) {
            req.userId = decodedToken.userId
            next();
        } else {
            return res.status(400).send({ status: false, message: 'Oops...token is not valid' })
        }
    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}

//-----------------------------------------------------------------------------//
module.exports.checkLogin = checkLogin;
//-----------------------------------------------------------------------------//