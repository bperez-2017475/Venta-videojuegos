'use strict'

const jwt = require('jwt-simple');
const secretkey = 'CualquierDato';

exports.ensureAuth = (req, res, next)=>{
    if(!req.headers.authorization){
        return res.status(403).send({messagge: 'The request does not contain the authentication header'})
    }else{
        try{
            let token = req.headers.authorization.replace(/['"]+/g, '');
            var payload = jwt.decode(token, secretkey);
        }catch(err){
            console.log(err);
            return res.status(403).send({messagge: 'Token is not valid or expired'});
        }
        req.user = payload;
        next();
    }
}

exports.isAdmin = async (req, res, next)=>{
    try{
        const user = req.user;
        if(user.role === 'ADMIN') next()
        return res.status(403).send({messagge: 'User unauthorized'});
    }catch(err){
        console.log(err);
        return err;
    }
}