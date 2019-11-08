// ======================
//        APIKey
// ======================
process.env.FIRST_STEP = process.env.FIRST_STEP || "RGAPI-b4fc5034-5190-4d55-98f9-260d7d1ba279";

// let urlDB;
// if (process.env.NODE_ENV === 'dev') {
//     urlDB = 'mongodb://localhost:27017/ggdiggersUsers';
// } else {
//     urlDB = 'mongodb://localhost:27017/UsersTest';
// }
process.env.URLDB = 'mongodb://localhost:27017/UsersTest';
//process.env.URLDB = 'mongodb+srv://Guillermo:dEABUlxmFhwgR6ke@cluster0-ikvge.mongodb.net/ggdiggersUsers';

process.env.limit = 100;

process.env.Url = '77.229.95.253';
process.env.localUrl = 'localhost';
// ======================
// Vencimiento del token
// ======================
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


// ======================
// SEED de autenticación
// ======================
process.env.SEED = 'este-es-el-seed-de-desarrollo';
process.env.PORT = process.env.PORT || 3000;