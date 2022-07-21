'use strict'

const mongoose = require('mongoose');

exports.init = ()=>{
    const uriMongo = 'mongodb://127.0.0.1:27017/refugioPerros'
    mongoose.Promise = global.Promise;

    mongoose.connection.on('error', ()=>{
        console.log('MongoDB / could not connect to mongodb');
        mongoose.disconnect();
    });
    mongoose.connection.on('connecting', ()=>{
        console.log('MongoDB / try connecting');
    });
    mongoose.connection.on('connected', ()=>{
        console.log('MongoDB / connected');
    });
    mongoose.connection.once('open', ()=>{
        console.log('MongoDB / connected to DB');
    });
    mongoose.connection.on('reconnected', ()=>{
        console.log('MongoDB / reconnected to DB');
    });
    mongoose.connection.on('disconnected', ()=>{
        console.log('MongoDB / error, mongodb is disconnected');
    });


    mongoose.connect(uriMongo, {
        maxPoolSize: 50,
        useNewUrlParser: true,
        connectTimeoutMS: 2500,
    }).catch(err=>console.log(err));
}