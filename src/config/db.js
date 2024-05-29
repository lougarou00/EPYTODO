const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

db.connect((err) => {
  if (err) {
      console.log('Error connecting to database:', err);
      return;
  }
  console.log('Database connected successfully.');
});

module.exports = db;
