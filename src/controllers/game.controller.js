'use strict'

const {validateData, checkUpdate, checkPermission} = require('../utils/validate');
const Game = require('../models/game.model');

exports.testgame = (req, res)=>{
    return res.send({message: 'Funcion testgame esta funcionando'});
} 

exports.saveGame = async (req, res)=>{
    try{
        const params = req.body;
        const data = {
            name: params.name,
            type: params.type,
            user: req.user.sub
        };
        const msg = validateData(data);
        if(!msg){
            data.description = params.description;
            const game = new Game(data); 
            await game.save();
            return res.send({message: 'Juego guardado'});
        }else return res.status(400).send(msg);
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.getGames = async (req, res)=>{
    try{
        const games = await Game.find();
        return res.send({games});
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.getGame = async (req, res)=>{
    try{
        const gameId = req.params.id;
        const game = await Game.findOne({_id: gameId});
        if(!game) return res.send({message: 'Juego no encontrado'});
        return res.send({game});
    }catch(err){
        console.log(err);
        return err; 
    }
}

exports.searchGame = async (req, res)=>{
    try{
        const params = req.body;
        const data = {
            name: params.name
        };
        const msg = validateData(data);
        if(!msg){
            const game = await Game.find({name: {$regex:  params.name, $options: 'i'}});
            return res.send({game});
        }else return res.status(400).send(msg);
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.updateGame = async (req, res)=>{
    try{
        const params = req.body;
        const gameId = req.params.id;
        const check = await checkUpdate(params);
        if(check === false) return res.status(400).send({message: 'Informacion no recivida'});
        const updateGame = await Game.findOneAndUpdate({_id: gameId}, params, {new: true})
        .populate('user');
        updateGame.user.password = undefined;
        updateGame.user.role = undefined;
        return res.send({message: 'Juego actualizado', updateGame});
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.deletedGame = async (req, res)=>{
    try{
        const gameId = req.params.id;
        const permission = await checkPermission(gameId, req.game.sub);
        if(permission === false) return res.status(403).send({message: 'Accion inautorizada'});
        const gameDeleted = await Game.findOneAndDelete({_id: gameId});
        if(gameDeleted) return res.send({gameDeleted, message: 'Juego borrado'});
        return res.send({mesagge: 'Juego no encontrado o ya borrado'});
    }catch(err){
        console.log(err);
        return err;
    }
}