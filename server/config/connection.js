// const mongoose = require("mongoose");
// require("dotenv").config();
//
// mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/PARSR");
//
// module.exports = mongoose.connection;

const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

console.log(process.env.PG_USER);

// Sequelize instance
const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    username: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});

sequelize.authenticate()
    .then(() => {
        console.log('Connection to the database has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
        process.exit(-1);
    });

module.exports = sequelize;