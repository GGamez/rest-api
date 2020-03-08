//Core Module
const nodemailer = require('nodemailer');
path = require('path');

const uuid = require("uuid/v4");
const bcrypt = require('bcrypt');
const converter = require('jsonexport/lib')
const jwt = require('jsonwebtoken');
const { getAll, getUserData, getMatches, print } = require('./getters/matchHistory');
var async = require('async')
var queue = async.queue
const mongoose = require('mongoose');
const Usuario = require('./models/usuario');
const Coleccion = require('./models/collar');
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


var exec = require('exec')

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

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
    (err, res) => {
        if (err) throw err;
        //console.log('Base de datos ONLINE')
    });



app.listen(port, () => {
    //console.log('Escuchando puerto: ', port);
});




//app.get('/', (req, res) => res.send('Hello SSL!'))


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

app.get('/search', (req, res) => {

    //console.log(req.params.id)
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 1200;
    limite = Number(limite);
    var Assignment = new mongoose.model(Date.now(), new Schema({}), 'ravens');

    // const { exec } = require("child_process");
    // exec('"C:/Program Files/R/R-3.6.2/bin/Rscript.exe" C:/Users/GuiGamez/Desktop/NODEJS/GGDiggers_LOL/server/pyth/R_Scripts/as.R', (error, stdout, stderr) => {
    //     if (error) {
    //         console.log(`error: ${error.message}`);
    //         return;
    //     }
    //     if (stderr) {
    //         console.log(`stderr: ${stderr}`);
    //         return;
    //     }
    //     console.log(`stdout: ${stdout}`);
    // });


    var spawn = require("child_process").spawn;
    var process = spawn('C:/Program Files/R/R-3.6.2/bin/Rscript.exe', ["C:/Users/GuiGamez/Desktop/NODEJS/GGDiggers_LOL/server/pyth/R_Scripts/ass.R"])

    //console.log(process);
    let actualizedMatches = [];
    process.stdout.on('data', (chunk) => {
        //console.log(`stdout: ${chunk}`);
        actualizedMatches.push(chunk)

        // console.log(filePath);
        //text/csv

        //res.setHeader('Content-Type', 'text/csv'); //text/csv
        //res.send(require('server/pyth/data.csv'))


        // fs.appendFile(`server/jsons/matches/HOLYYYYYYY_Matches.txt`, textChunk, function(err) {
        //     if (err) throw err;
        // });
        //console.log(textChunk);
    });

    process.stdout.on('close', (code) => {
        //console.log(actualizedMatches);
        let dataBuffer = Buffer.concat(actualizedMatches);
        let dato = (dataBuffer.toString());
        res.setHeader('Content-Type', 'text/csv'); //text/csv
        res.send(JSON.parse(JSON.stringify(dato)))
    });
    []

    // Assignment.find({}, {})
    //     .skip(desde)
    //     .limit(limite)
    //     .exec((err, assignments) => {
    //         if (err) {
    //             return res.status(400).json({
    //                 ok: false,
    //                 err
    //             });
    //         }

    //         assignments.forEach(function(kitten) {
    //             console.log(kitten._doc.exp);
    //         });

    //         res.json({...assignments });
    //     });
});


app.get('/search/csv/:id', (req, res) => {

    console.log(req.params.id)
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
                //console.log(assignments)
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
                        // console.log(tosave)
                        //res.json({...assignments });
                });
                //const csvData = csvjson.toCSV(assignments, options);
                //let saves = csvData

                res.setHeader('Content-Type', 'text/csv'); //text/csv
                res.send(tosave[0])



                // console.log("Invoking R script... at:", rscriptPath);
                // callR(rscriptPath)
                //     .then(result => {
                //         console.log("finished with result:", result);
                //     })
                //     .catch(error => {
                //         console.log("Finished with error:", error);
                //     });


                // console.log(process)

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

app.get('/colecciones', function(req, res) {

    let body = req.body;
    var Assignment = new mongoose.model(Date.now(), new Schema({}), 'coleccions');
    Assignment.find({}, {})
        .exec((err, assignments) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({...assignments });
        });

});

app.get('/collares/:nombre', function(req, res) {

    let body = req.body;
    console.log(req.params.nombre)
    var Assignment = new mongoose.model(Date.now(), new Schema({}), 'coleccions');
    Assignment.find({ "coleccion.nombre": req.params.nombre }, { coleccion: { $elemMatch: { nombre: req.params.nombre } } })
        .exec((err, assignments) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({...assignments });
        });

});

app.post('/coleccion', function(req, res) {

    let body = req.body;

    let coleccion = new Coleccion({
        nombre: body.nombre,
    });

    coleccion.save((err, coleccionDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }



        res.json({
            ok: true,
            usuario: coleccionDB
        });
    });

});

app.post('/collar', function(req, res) {

    let body = req.body;

    Coleccion.findOne({ nombre: body.coleccion }, (err, coleccionDb) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario incorrecto'
                },
                message: 'Usuario incorrecto'
            });
        }

        if (!coleccionDb) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario incorrecto'
                },
                message: 'Usuario incorrecto'
            });
        }

        let newCollar = {
            nombre: body.nombre,
            precio: body.precio,
            coll: body.text
        }

        let newColeccion = coleccionDb;
        newColeccion.coleccion.push(newCollar)

        newColeccion.save((err, coleccionDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
        });

        res.json({
            ok: true,
            // collar: collar.coleccion,
            message: 'user loggin correct',
            //url: "http://localhost:3000/features",
            //token
        })

    })

});





app.post('/login', [verificarToken], function(req, res) {

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


        if (usuarioDB.estado == false) {
            return res.status(401).json({
                ok: false,
                err: 'Usuario no verificado',
                message: 'por favor, revisa tu correo',
            });
        } else {
            res
                .json({
                    ok: true,
                    //usuario: usuarioDB,

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


app.post('/regist', isEmailValid, function(req, res) {



    let body = req.body;
    //console.log(body)
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
    });


    //console.log(req.body)
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
        var mailOptions = {
            from: 'no-reply@ggdiggers.com',
            to: body.email,
            subject: 'Account Verification Token',
            text: 'Hello,\n\n' + `Please verify your account by clicking the link: \nhttp:\/\/${process.env.localUrl}:3001\/confirmation\/` + token + '.\n',
            html: '<!DOCTYPE html>' +
                '<html><head><title>Appointment</title>' +
                '</head><body><div>' +
                '<img src="http://localhost:3001/static/media/bitmap.1a7c181b.png" alt="" width="160">' +
                '<p>Thank you for your appointment.</p>' +
                '<p>Here is summery:</p>' +
                '<p>Name: James Falcon</p>' +
                '<p>Date: Feb 2, 2017</p>' +
                '<p>Package: Hair Cut </p>' +
                '<p>Arrival time: 4:30 PM</p>' +
                '</div></body></html>'
        };
        transporter.sendMail(mailOptions, function(err) {
            if (err) { return res.status(500).send({ msg: err.message }); }
            res.json({
                ok: true,
                usuario: usuarioDB,
                token
            });
        });

        // res.json({
        //     ok: true,
        //     usuario: usuarioDB,
        //     message: 'user loggin correct',
        //     //url: "http://localhost:3000/features",
        // })

    })



    // res.json({
    //     ok: true,
    //     usuario: usuarioDB,
    // });



});

app.post('/loggin', function(req, res) {



    let body = req.body;
    console.log(body)

    //console.log(req.body)
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

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Contraseña incorrecta'
                },
                message: 'Usuario incorrecto'
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB,
            message: 'user loggin correct',
            //url: "http://localhost:3000/features",
            token
        })

    })
});

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const stripeChargeCallback = res => (stripeErr, stripeRes) => {
    if (stripeErr) {
        res.status(500).send({ error: stripeErr });
    } else {
        res.status(200).send({ success: stripeRes });
    }
};


app.get("/", (req, res) => {
    res.send({
        message: "Hello Stripe checkout server!",
        timestamp: new Date().toISOString()
    });
});

app.post("/checkout", async(req, res) => {
    console.log("Request:", req.body);

    let error;
    let status;
    try {
        const { producto, token, email } = req.body;

        const customer = await stripe.customers.create({
            email: email,
            source: token.id
        });

        const idempotency_key = uuid();
        const charge = await stripe.charges.create({
            amount: producto.price * 100,
            currency: "usd",
            customer: customer.id,
            receipt_email: email,
            description: `Purchased the ${producto.name}`,
            shipping: {
                name: token.card.name,
                address: {
                    line1: token.card.address_line1,
                    line2: token.card.address_line2,
                    city: token.card.address_city,
                    country: token.card.address_country,
                    postal_code: token.card.address_zip
                }
            }
        }, {
            idempotency_key
        });
        console.log("Charge:", { charge });
        status = "success";
    } catch (error) {
        console.error("Error:", error);
        status = "failure";
    }

    res.json({ error, status });
});


app.post('/testio', function(req, res) {

    let body = req.body;


    let usuario = new Usuario({
        id: body.id,
        exp: body.experiment,
        dateExp: body.lastExp
    });

    console.log(body)
        //console.log(req.body)
    Usuario.findOne({ _id: body.id }, (err, usuarioDB) => {

        let tipo = body.experiment.experimento;
        let userDb = usuarioDB;
        let newTest = {

            exp: body.experiment,
            id: body.id,
            dateExp: body.lastExp

        }
        console.log(userDb.tests[`${tipo}`])
        userDb.tests[`${tipo}`].push(newTest);
        if (err) {
            console.log(err)
        }

        userDb.save((err, usuarioDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
            });
        });
        // if (err) {
        //     NBack.findByIdAndUpdate(body.id, {
        //         user: body.id,
        //         exp: body.experiment,
        //         dateExp : body.lastExp
        //     }, { new: true, runValidators: true, useFindAndModify: false, context: 'query' }, (err, usuarioDB) => {
        //         if (err) {
        //             console.log(err)
        //         }
        //     })
        // }
        // res.json({
        //     ok: true,
        // });
    })
});

app.post('/n-back', function(req, res) {

    let body = req.body;

    let usuario = new Usuario({
        id: body.id,
        exp: body.experiment,
        dateExp: body.lastExp
    });

    console.log(body)
        //console.log(req.body)
    Usuario.findOne({ _id: body.id }, (err, usuarioDB) => {


        let userDb = usuarioDB;
        let newTest = {

            exp: body.experiment,
            id: body.id,
            dateExp: body.lastExp

        }
        console.log(userDb)
        userDb.tests.nBack.push(newTest);
        if (err) {
            console.log(err)
        }

        userDb.save((err, usuarioDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
            });
        });
        // if (err) {
        //     NBack.findByIdAndUpdate(body.id, {
        //         user: body.id,
        //         exp: body.experiment,
        //         dateExp : body.lastExp
        //     }, { new: true, runValidators: true, useFindAndModify: false, context: 'query' }, (err, usuarioDB) => {
        //         if (err) {
        //             console.log(err)
        //         }
        //     })
        // }
        res.json({
            ok: true,
        });
    })
});


app.post('/raven', function(req, res) {

    let body = req.body;

    let usuario = new Usuario({
        id: body.id,
        exp: body.experiment,
        dateExp: body.lastExp
    });

    console.log(body)
        //console.log(req.body)
    Usuario.findOne({ _id: body.id }, (err, usuarioDB) => {


        let userDb = usuarioDB;
        let newTest = {

            exp: body.experiment,
            id: body.id,
            dateExp: body.lastExp

        }
        console.log(userDb)
        userDb.tests.raven.push(newTest);
        if (err) {
            console.log(err)
        }

        userDb.save((err, usuarioDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
            });
        });
        // if (err) {
        //     Raven.findByIdAndUpdate(body.id, {
        //         user: body.id,
        //         exp: body.experiment,
        //         dateExp: body.lastExp
        //     }, { new: true, runValidators: true, useFindAndModify: false, context: 'query' }, (err, usuarioDB) => {
        //         if (err) {
        //             console.log(err)
        //         }
        //     })
        // }

    })
});


app.get('/time-to-nback', (req, res) => {

    let id = req.get('id');
    //let id = req.body.id;
    console.log(id)
        //console.log(req.params.id)
    NBack.find({ id: id }, (err, usuarioDB) => {
        if (err) {
            console.log(err)
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario incorrecto'
                },
                message: 'Usuario incorrecto'
            });
        }

        if (!usuarioDB) {
            console.log(err)
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario incorrecto'
                },
                message: 'Usuario incorrecto'
            });
        }

        let date = '';
        var size = Object.keys(usuarioDB).length;
        console.log(size)
        if (size >= 1) {
            date = (usuarioDB[size - 1])
        } else {
            date = (usuarioDB[size])
        }

        res.json({ date, size });

    })
});

app.get('/time-to-raven', (req, res) => {

    let id = req.get('id');
    //let id = req.body.id;
    console.log(id)
        //console.log(req.params.id)
    Raven.find({ id: id }, (err, usuarioDB) => {
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


        let date = '';
        var size = Object.keys(usuarioDB).length;
        console.log(size)
        if (size >= 1) {
            date = (usuarioDB[size - 1])
        } else {
            date = (usuarioDB[size])
        }

        res.json({ date, size });

    })
});



app.get('/n-back-Rsults', [verificarToken, verificarSummonerName], function(req, res) {

    let id = req.get('id');
    console.log(id)


    NBack.findOne({ id: id }, (err, usuarioDB) => {
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



        res.json({
            ok: true,
            usuario: usuarioDB,
            message: 'user loggin correct',
            //url: "http://localhost:3000/features",
        })

    })
});



app.put('/confirmation', verificarMailToken, function(req, res) {

    let id = req.usuario._id;
    let isUpdated = req.usuario.datos;
    //let body = _.pick(req.body, ['estado', 'datos'])
    let body = { estado: true, datos: true };
    console.log(req.usuario)


    if (req.usuario.datos == false) {
        Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true, useFindAndModify: false, context: 'query' }, (err, usuarioDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err,
                    asd: 'asdasdasd'
                });
            }


            let summonerName = req.usuario.nombre
                //console.log(req.usuario.nombre)
                //getAll('euw1', summonerName, id)

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