//Core Module
const nodemailer = require('nodemailer');

const bcrypt = require('bcrypt');
const converter = require('jsonexport/lib')
const jwt = require('jsonwebtoken');
const { getAll, getUserData, getMatches, print } = require('./getters/matchHistory');

const mongoose = require('mongoose');
const Usuario = require('./models/usuario');
const Raven = require('./models/raven');
const NBack = require('./models/nBack');
require('./config/config');
const conf = require('./config');
const bodyParser = require('body-parser');
const argv = require('./arguments/playerArgvs').argv;
const fs = require('fs')
const cors = require('cors');
const sleep = require('sleep');

let comando = argv._[0];
var Schema = mongoose.Schema;

var http = require('http');
var https = require('https');
// var privateKey = fs.readFileSync('./sslcert/cert.key');
// var certificate = fs.readFileSync('./sslcert/cert.pem');

// var credentials = {
//     key: privateKey,
//     cert: certificate,
//     requestCert: false,
//     agent: false,
//     //ca: fs.readFileSync('/etc/ssl/certs/ca.crt'),
//     rejectUnauthorized: false,
//     passphrase: '123456'
// };
const express = require('express');
const app = express();

// your express configuration here

//var httpsServer = https.createServer(credentials, app);

const port = process.env.PORT
const { verificarToken, verificarMailToken, verificarTokeno, verificarAdmin, verificarSummonerName, isEmailValid } = require('./middlewares/autenticacion')
    // parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(cors(
    conf
));

mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
    (err, res) => {
        if (err) throw err;
        //console.log('Base de datos ONLINE')
    });



app.listen(port, () => {
    //console.log('Escuchando puerto: ', port);
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', (req, res) => res.send('Hello SSL!'))


app.get("/link", [verificarToken], function(req, res) {

    //var Schema = mongoose.Schema;
    var Assignment = new mongoose.model(Date.now(), new Schema({}), 'perdiguero_Nested');
    var stream = Assignment.find({}, {}).stream();

    stream.on("data", function(d) {
        //res.json(d);
        //console.log(d)
        sleep.msleep(500)

    });
    stream.on("end", function() {
        console.log("done");
        // db.close();
        //res.end();

    });
});

app.get('/search/:id', [verificarToken], (req, res) => {

    //console.log(req.params.id)
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 1200;
    limite = Number(limite);
    var Assignment = new mongoose.model(Date.now(), new Schema({}), req.params.id);

    Assignment.find({}, {})
        .skip(desde)
        .limit(limite)
        .exec((err, assignments) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            //let tosave = []
            Assignment.count({}, (err, conteo) => {

                converter(JSON.parse(JSON.stringify(assignments)), { verticalOutput: true }, function(err, csv) {
                    //console.log(csv)
                    res.statusCode = 200;
                    // res.setHeader('Content-Type', 'text/csv'); //text/csv
                    // res.setHeader('Access-Control-Allow-Origin', '*');
                    // res.setHeader('Access-Control-Allow-Credentials', 'true');
                    // res.setHeader('Access-Control-Allow-Methods', 'GET');
                    // res.setHeader('Access-Control-Max-Age', '86400');
                    // tosave.push(csv)
                    //console.log(tosave)
                    res.json({...assignments });
                });
                //const csvData = csvjson.toCSV(assignments, options);
                //let saves = csvData
                //res.setHeader('Content-Type', 'text/csv'); //text/csv
                // res.send(tosave[0])
                // res.send(tosave);
            });
        });
});

app.get('/search/csv/:id', [verificarToken], (req, res) => {

    //console.log(req.params.id)
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 1200;
    limite = Number(limite);
    var Assignment = new mongoose.model(Date.now(), new Schema({}), req.params.id);

    Assignment.find({}, {})
        .skip(desde)
        .limit(limite)
        .exec((err, assignments) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            let tosave = []
            Assignment.count({}, (err, conteo) => {

                converter(JSON.parse(JSON.stringify(assignments)), { verticalOutput: true }, function(err, csv) {
                    //console.log(csv)
                    res.statusCode = 200;
                    // res.setHeader('Content-Type', 'text/csv'); //text/csv
                    // res.setHeader('Access-Control-Allow-Origin', '*');
                    // res.setHeader('Access-Control-Allow-Credentials', 'true');
                    // res.setHeader('Access-Control-Allow-Methods', 'GET');
                    // res.setHeader('Access-Control-Max-Age', '86400');
                    tosave.push(csv)
                    console.log(tosave)
                        //res.json({...assignments });
                });
                //const csvData = csvjson.toCSV(assignments, options);
                //let saves = csvData
                res.setHeader('Content-Type', 'text/csv'); //text/csv
                res.send(tosave[0])
                    // res.send(tosave);
            });
        });
});

app.post('/usuario', isEmailValid, function(req, res) {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        var transporter = nodemailer.createTransport('smtps://ggamezcorcho@gmail.com:lfrujvfxrgzliles@smtp.gmail.com');
        var mailOptions = { from: 'no-reply@ggdiggers.com', to: body.email, subject: 'Account Verification Token', text: 'Hello,\n\n' + `Please verify your account by clicking the link: \nhttp:\/\/${process.env.localUrl}:3001\/confirmation\/` + token + '.\n' };
        transporter.sendMail(mailOptions, function(err) {
            if (err) { return res.status(500).send({ msg: err.message }); }
            res.json({
                ok: true,
                usuario: usuarioDB,
                token
            });
        });

        //usuarioDB.password = null;

        // res.json({
        //     ok: true,
        //     usuario: usuarioDB
        // });
    });

});

app.post('/login', function(req, res) {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario incorrecto'
                },
                message: 'Usuario incorrecto'
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario incorrecto'
                },
                message: 'Usuario incorrecto'
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Contraseña incorrecta'
                },
                message: 'Usuario incorrecto'
            });
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });


        if (!usuarioDB.estado || usuarioDB.estado == false) {
            return res.status(401).json({
                ok: false,
                err: 'Usuario no verificado'
            });
        } else {
            res
                .json({
                    ok: true,
                    usuario: usuarioDB,
                    message: 'user loggin correct',
                    //url: "http://localhost:3000/features",
                    token
                })
        }
        //res.set('token', token);
        //res
        //.set('token', token)
        //.cookie('token', token, { maxAge: process.env.CADUCIDAD_TOKEN })
        //   .redirect(`http://localhost:3000/features`);
    });
});

app.post('/n-back', function(req, res) {

    let body = req.body;

    let usuario = new NBack({
        _id: body.id,
        exp: body.experiment,
    });

    //console.log(req.body)
    usuario.save((err, usuarioDB) => {
        if (err) {
            NBack.findByIdAndUpdate(body.id, {
                user: body.id,
                exp: body.experiment,
            }, { new: true, runValidators: true, useFindAndModify: false, context: 'query' }, (err, usuarioDB) => {
                if (err) {
                    console.log(err)
                }
            })
        }
        res.json({
            ok: true,
        });
    })
});


app.post('/raven', function(req, res) {

    let body = req.body;

    let usuario = new Raven({
        _id: body.id,
        exp: body.experiment,
    });

    //console.log(req.body)
    usuario.save((err, usuarioDB) => {
        if (err) {
            Raven.findByIdAndUpdate(body.id, {
                user: body.id,
                exp: body.experiment,
            }, { new: true, runValidators: true, useFindAndModify: false, context: 'query' }, (err, usuarioDB) => {
                if (err) {
                    console.log(err)
                }
            })
        }
        res.json({
            ok: true,
        });
    })
});



app.put('/confirmation', verificarMailToken, function(req, res) {

    let id = req.usuario._id;
    let isUpdated = req.usuario.datos;
    //let body = _.pick(req.body, ['estado', 'datos'])
    let body = { estado: true, datos: true };


    if (!req.usuario.datos) {
        Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true, useFindAndModify: false, context: 'query' }, (err, usuarioDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }


            let summonerName = req.usuario.nombre
                //console.log(req.usuario.nombre)
            getAll('euw1', summonerName, id)

            // .then(resultado => {

            //     mongoose.connection.close(function() {
            //         console.log('all files saved')
            //         process.exit();
            //     });

            // });
            //console.log(id)
            //console.log(req)
            res.json({
                ok: true,
                usuario: usuarioDB
            });
        })
    } else {
        Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true, useFindAndModify: false, context: 'query' }, (err, usuarioDB) => {


            // .then(resultado => {

            //     mongoose.connection.close(function() {
            //         console.log('all files saved')
            //         process.exit();
            //     });

            // });
            //console.log(id)
            res.json({
                ok: true,
            });
        })
    }

});