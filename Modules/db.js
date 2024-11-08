const {Pool} = require('pg');
require('dotenv').config();
const pool = new Pool({
    connectionString: process.env.POSTGRES_URL 
});

module.exports = pool;