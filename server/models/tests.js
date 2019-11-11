const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
}

let Schema = mongoose.Schema;

let testsSchema = new Schema({
    exp: {

    },
    user: {
        type: String,
        unique: true,

    },
    ess: []

});

testsSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });
// usuarioSchema.methods.toJSON = function() {
//     let user = this;
//     let userObject = user.toObject();
//     delete userObject.password;

//     return userObject;
// }

// usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });

module.exports = mongoose.model('Tests', testsSchema);