// Use the MariaDB Node.js Connector
var mariadb = require('mariadb');
 
// Create a connection pool
var pool = 
  mariadb.createPool({
    host: "",
    port: 3306,
    user: "root", 
    password: "testp4ss",
    database: "team17_clinic_db"
  });
 
// Expose a method to establish connection with MariaDB SkySQL
module.exports = Object.freeze({
  pool: pool
});
