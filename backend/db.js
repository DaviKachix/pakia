const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "country",
  password: "ps_country",
  database: "pakia"
});

db.connect(err => {
  if (err) console.log(err);
  else console.log("MySQL Connected");
});

module.exports = db;
