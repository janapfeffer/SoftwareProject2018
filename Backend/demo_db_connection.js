/*
1. The following code has to be executed on the mysql database in order for the code to work:
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password'
2. mysql for node has to be installed before running the code:
run "npm install mysql" in the command line
3. see https://www.w3schools.com/nodejs/nodejs_mysql.asp for help
*/
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

var sql = "INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37')";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });
