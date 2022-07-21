'user strict'

const User = require('../models/user.model');
const {validateData, searchUser, encript, checkPassword, checkPermission, checkUpdate} = require('../utils/validate');
const jwt = require('../services/jwt');

exports.test = (req, res)=>{
    return res.send({message: 'Funcion test esta funcionando'});
}

exports.register = async (req, res)=>{
    try{
        const params = req.body;
        const data = {
            name: params.name,
            username: params.username,
            password: params.password,
            role: 'CLIENTE'
        }

        const msg = validateData (data);

        if(!msg){
             let userExist = await searchUser(params.username);
             if(userExist){
                 data.surname = params.surname;
                 data.email = params.email;
                 data.phone = params.phone;
                 data.password = await encrypt(params.password);

                let user = new User(data);
                await user.save();
                return res.send({message: 'Usuario Creado exitosamente'});                 
             }else{
                return res.send({message: 'Nombre de usuario ya en uso, elije otro nombre'});
             }           
        }else{
            return res.status(400).send(msg);
        }
    }catch(err){
        console.log(err);
        return err;
    }   
}

exports.login = async (req, res)=>{
    try{
        const params = req.body;
        const data = {
            username: params.username,
            password: params.password
        }
        let msg = validateData(data);

        if(!msg){
            let userExist = await searchUser(params.username);
            if(userExist && await checkPassword(params.password, userExist.password)){
                const token = await jwt.createToken(userExist);

                return res.send({token,message: 'Inicio de sesión con éxito'})
            }else{
                return res.send({message: 'Nombre de usuario o contraseña incorrecto'})
            }
        }else{
            return res.status(400).send({msg})
        }
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.update = async (req, res)=>{
    try{
        const userId = req.params.id;
        const params = req.body;
        const permission = await checkPermission(userId, req.user.sub);
        if(permission === false) return res.status(403).send({message: 'Inautorizado para actualizar este Usuario'});
        else{
            const notUpdated = await checkUpdate(params);
            if(notUpdated === false) return res.status(400).send({message: 'Estos parámetros solo los puede actualizar el administrador'});
            const already = await searchUser(params.username);
            if(!already){
                const userUpdated = await User.findOneAndUpdate({_id: userId}, params, {new: true})
                .lean()
                return res.send({userUpdated, message: 'Usuario actualizado'});
            }else {
                return res.send({message: 'Nombre de usuario ya en uso'})
        }
        }
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.deleted = async (req, res)=>{
    try{
        const userId = req.params.id;
        const permission = await checkPermission(userId, req.user.sub);
        if(permission === false) return res.status(403).send({message: 'Accion inaitorizada'});
        const userDeleted = await User.findOneAndDelete({_id: userId});
        if(userDeleted) return res.send({userDeleted, message: 'Cuenta borrada'});
        return res.send({message: 'Usuario no encontrado y a sido borrado'});
        
    }catch(err){
        console.log(err);
        return err;
    }
}