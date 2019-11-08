const jwt = require('jsonwebtoken');
const _ = require('underscore');
const Usuario = require('../models/usuario');
var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

let isEmailValid = (req, res, next) => {

    let email = req.body.email;
    console.log(req)

    if (!email)
        return res.status(401).json({
            ok: false,
            err: 'Mail no valido'
        });

    if (email.length > 254)
        return res.status(401).json({
            ok: false,
            err: 'Mail no valido'
        });
    var valid = emailRegex.test(email);
    if (!valid)
        return res.status(401).json({
            ok: false,
            err: 'Mail no valido'
        });

    // Further checking of some things regex can't handle
    var parts = email.split("@");
    if (parts[0].length > 64)
        return res.status(401).json({
            ok: false,
            err: 'Mail no valido'
        });

    var domainParts = parts[1].split(".");
    if (domainParts.some(function(part) { return part.length > 63; }))
        return res.status(401).json({
            ok: false,
            err: 'Mail no valido'
        });

    next();
}

//======================
//   Verificar Token
//======================

let verificarToken = (req, res, next) => {
    let token = req.get('token');
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: 'Token no valido'
            });
        }

        req.usuario = decoded.usuario;

        next();
    })

};

let verificarMailToken = (req, res, next) => {
    let token = req.body.token;
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: 'Token no valido'
            });
        }

        req.usuario = decoded.usuario;

        next();
    })

};


//======================
//   Verificar Email-Validation
//======================






//========================
//   Verificar Token Img
//========================

let verificarTokenImg = (req, res, next) => {
    let token = req.query.token;
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: 'Token no valido'
            });
        }

        req.usuario = decoded.usuario;


        next();
    })

};

//=======================
//  Verificar AdminRole
//=======================

let verificarAdmin = (req, res, next) => {
    let usuario = req.usuario;
    if (usuario.role == 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }
};


let verificarSummonerName = (req, res, next) => {

    let token = req.get('token');
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: 'Token no valido'
            });
        }

        req.usuario = decoded.usuario;

        let usuario = req.usuario;
        console.log(req.params.id)
        if (usuario.nombre == req.params.id) {
            next();
        } else {
            return res.json({
                ok: false,
                err: {
                    message: 'El usuario de búsqueda no coincide'
                }
            });
        }

    });
}


module.exports = {
    verificarToken,
    verificarMailToken,
    verificarTokenImg,
    verificarAdmin,
    verificarSummonerName,
    isEmailValid
}