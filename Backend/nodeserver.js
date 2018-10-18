//https://www.w3schools.com/nodejs/nodejs_http.asp
// var http = require('http');
// var url = require('url');
var mysql = require("mysql");
var express = require("express");

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

// http.createServer(function (req, res) {
//   res.write('Hello World!'); //write a response to the client
//   res.end(); //end the response
// }).listen(8080); //the server object listens on port 8080

var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/event_types', function (req, res) {
  con.query("SELECT * FROM event_finder.event_types;", function (err, result, fields) {
    if (err) {
      throw err;
    } else {
      res.send(result);
    }
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
