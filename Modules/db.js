const {Pool} = require('pg')
require('dotenv').config();
const client = new Pool({
    
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: process.env.SENHA_BD,
    database: "Blog"
});

module.exports = client;