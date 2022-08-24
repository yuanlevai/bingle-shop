const jwt = require ("jsonwebtoken");
const salt = "rahasia";
// const jwt_decode = require('jwt-decode');

//  mwlanjutkan request user ke controller
const verifyToken = function(req, res, next) {
    //  1. mengecek apakah request memiliko token di header 
    const baearerToken = req.headers["authorization"];

    if(!baearerToken) {
        res.status(401).send("you must login first");
        return;        
    }

    // mengecek apakah tokennya valid
    const splitBeareToken = baearerToken.split(" ");
    const token = splitBeareToken[1];

    jwt.verify(token, salt, function(err, decodedToken) {
        if(err) {
            res.status(401).send("Unauthorized")
            return;
        }
        next()
    })
}

module.exports = verifyToken;