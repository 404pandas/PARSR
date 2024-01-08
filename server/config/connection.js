// const mongoose = require("mongoose");
// require("dotenv").config();
//
// mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/PARSR");
//
// module.exports = mongoose.connection;

const { Pool } = require('pg');
const path = require('path');
require("dotenv").config({ path: path.resolve(__dirname, '../.env') });

console.log(process.env.PG_USER);

const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});

pool.query('SELECT NOW()', (err, result) => {
    if (err) {
        return console.error('Error executing query', err);
    }
    console.log(`Successfully connected to database at ${result.rows[0].now} on port ${process.env.PG_PORT}`);
    pool.end();
});
