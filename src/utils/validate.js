'use strict'

const bcrypt = require('bcrypt-nodejs');
const User = require('../models/user.model');

exports.validateData = (data)=>{    
    let keys = Object.keys(data), msg = '';

    for(let key of keys){
        if(data[key] !== null && data[key] !== undefined && data[kay] !== '') continue;           
            msg += 'The param ${key} is required\n';
    }   
    return msg.trim();
}

exports.searchUser = async (username)=>{
    try{
        // Logica (Buscar en la base de datos mediante en username) 
        let exist = User.findOne({username: username}) //.Lean -> mongoose Objects -> javascript Object
        return exist;
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.encrypt = async (password)=>{
    try{
        return bcrypt.hashSync(password);
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.checkPassword = async (password, hash)=>{
    try{
        return bcrypt.compareSync(password, hash);
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.checkPermission = async (userId, sub)=>{
    try{
        if(userId != sub)
            return false;
        else
            return true;
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.checkUpdate = async (user)=>{
    try{
        if(user.password || Object.entries(user).length === 0 || user.role)
            return false;
        else 
            return true;
    }catch(err){
        console.log(err);
        return err;
    }
}