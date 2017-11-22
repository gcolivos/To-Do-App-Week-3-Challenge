var pg = require('pg');
// var pool = new pg.Pool(config); //creating pool of connections to our database, limit 10

var config = {
    database: 'to_do', //the name of our database
    host: 'localhost', //where is your database (which computer)
    port: 5432, //the port number for your database, 5432 is default
    max: 10, //how many connections at one time
    idleTimeoutMillies: 30000 // 30 seconds to try to connect to our database
}

module.exports = new pg.Pool(config)