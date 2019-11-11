const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
}

let Schema = mongoose.Schema;

let ravenSchema = new Schema({
    exp: {

    },
    _id: {
        type: String,
        unique: true,

    }


});


//     let user = this;
//     let userObject = user.toObject();
//     delete userObject.password;

//     return userObject;
// }

ravenSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });

module.exports = mongoose.model('Raven', ravenSchema);