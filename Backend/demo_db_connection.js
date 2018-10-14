var mysql = require("mysql");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  insecureAuth : true
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

/*
The following code has to be executed on the mysql database in order for the code to work:
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password'
*/