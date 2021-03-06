const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
}

let Schema = mongoose.Schema;

let raven = new Schema({
    exp: [Object],
    id: {
        type: String,
    },
    dateExp: {
        type: String,
    }
});


let stroop = new Schema({
    exp: [Object],
    id: {
        type: String,
    },
    dateExp: {
        type: String,
    }
});


let nBack = new Schema({
    exp: [Object],
    id: {
        type: String,
    },
    dateExp: {
        type: String,
    }
});


let testsSchema = new Schema({
    nombre: String,
    raven: [raven],
    stroop: [stroop],
    nBack: [nBack]
});


let usuarioSchema = new Schema({
    nombre: {
        type: String,
        unique: true,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El email es necesario']
    },
    password: {
        type: String,
        required: [true, 'La password es necesaria']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: false
    },
    datos: {
        type: Boolean,
        default: false
    },
    google: {
        type: Boolean,
        default: false
    },
    summonerId: {
        type: String,
        default: 'false'
    },
    tests: {
        raven: [raven],
        nBack: [nBack],
        stroop: [stroop]

    }

});





usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });

module.exports = mongoose.model('Usuario', usuarioSchema);