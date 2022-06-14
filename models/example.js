const Mongoose = require('mongoose');
const { Schema, model } = Mongoose;

const example1Schema = new Schema({
    name: String
}, {versionKey: false});

// Crear un modelo
const example =  Mongoose.model('example', example1Schema);

module.exports = example;