//https://www.w3schools.com/nodejs/nodejs_http.asp
var http = require('http');
var url = require('url');
var mysql = require("mysql");

// connect to the database
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  insecureAuth : true
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to database.");
});

//#######################################################################

http.createServer(function (req, res) {
  res.write('Hello World!'); //write a response to the client
  res.end(); //end the response
}).listen(8080); //the server object listens on port 8080
