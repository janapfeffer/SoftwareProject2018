/*
1. The following code has to be executed on the mysql database in order for the code to work:
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password'
2. mysql for node has to be installed before running the code:
run "npm install mysql" in the command line
3. see https://www.w3schools.com/nodejs/nodejs_mysql.asp for help
4. change user and password to the one of your database if it's not identical!
*/
/*
Example code for sending an sql query:
// sql has to be replaced with a string containing an sql query
con.query(sql, function (err, result) {
  if (err) throw err;
  return result;
});

*/

//https://www.w3schools.com/nodejs/nodejs_http.asp
var http = require('http');
var url = require('url');
var mysql = require("mysql");

// connection to the database
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  insecureAuth : true
});

// All things that should be executed upon executing this file should be done here
function onInit(){
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to database.");
  });

  http.createServer(function (req, res) {
    res.write('Hello World!'); //write a response to the client
    res.end(); //end the response
  }).listen(8080); //the server object listens on port 8080
}

//#################Functions####################################################
//returns all event_types entries
function get_event_types() {
  con.query("SELECT * FROM event_finder.event_types;", function (err, result) {
    if (err) {
      throw err;
    } else {
      //console.log(result);
      return result;
    }
  });
};

// get the state of the connection: authenticated, disconnected
function get_connection_state(){
  return con.state;
};

//returns true or if the comment could be saved into the db successfully
function add_comment(event_id, user_id, text){
  var sqlstmt_beg = "INSERT INTO `event_finder`.`comments` (`event_id`, `user_id`, `comment`) VALUES ('";
  con.query( sqlstmt_beg + event_id + "', '" + user_id + "', '"+ text + "');", function (err, result) {
    if (err) {
      throw err;
    } else {
      //console.log(result);
      return true;
    }
  });
};
//add_comment(1,1,"Test comment from node.js");

// get all saved_events from the logged in user
function get_saved_events(user_id){
  con.query( "SELECT * FROM event_finder.saved_events WHERE user_id = " + user_id + ";", function (err, result) {
    if (err) {
      throw err;
    } else {
      return result;
    }
  });
};

//run onInit
onInit();
//#################Unused Helpful Code Snippets#################################
// // disconnect from database
// con.end(function(err) {
//   if (err) throw err;
//   console.log("Disconnected from database.");
// });
