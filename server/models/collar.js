const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
}

let Schema = mongoose.Schema;

let collarSchema = new Schema({
    nombre: String,
    precio: Number,
    coll: String,
    coleccion: String,
    unidades: Number,
    vendidos: Number
});


let collSchema = new Schema({
    nombre: String,
    coleccion: [collarSchema]
});


//     let user = this;
//     let userObject = user.toObject();
//     delete userObject.password;

//     return userObject;
// }

collSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });


module.exports = mongoose.model('Coleccion', collSchema);