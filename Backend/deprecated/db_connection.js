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
var mysql = require("mysql");
var express = require("express");

const db_name = "event_finder";

// connection to the database
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


//#################Functions####################################################
//returns all event_types entries
function get_event_types() {
  con.query(`SELECT * FROM ${db_name}.event_types;`, function (err, result) {
    if (err) {
      throw err;
    } else {
      return result;
    }
  });
};

function add_comment(event_id, user_id, comment_text){
  con.query(`INSERT INTO ${db_name}.comments (event_id, user_id, comment) VALUES ('${event_id}', '${user_id}', '${comment_text}');`, function (err, result) {
    if (err) {
      throw err;
    } else {
      return true;
    }
  });
}

// get all cities with events
function get_event_cities(){
  con.query(`SELECT DISTINCT(city) FROM ${db_name}.events;`, function (err, result) {
    if (err) {
      throw err;
    } else {
      return result;
    }
  });
}

function get_events(start_date, end_date, event_type, search_phrase, city){
  var sql = `SELECT * FROM ${db_name}.events WHERE `;
  // if (start_date != null && end_date != null){
  //   sql = sql + `((start_date BETWEEN "${start_date}" AND "${end_date}") OR (end_date BETWEEN "${start_date}" AND "${end_date}")) OR ((start_date BETWEEN "${start_date}" AND "${end_date}") AND (end_date BETWEEN "${start_date}" AND "${end_date}"))`;
  // }
  // if (event_type != null){
  //   sql = sql + ``;
  // }

  if (city != null){
    sql = sql + ` city = "${city}" `;
  }

  if (search_phrase != null){
    var search_words = tokenize(search_phrase.toLowerCase());
    for(var i = 0; i < search_words.length; i++){
      sql = sql + ` LOWER(name) LIKE "%${search_words[i]}%" `;
      if ( i + 1 < search_words.length){
        sql = sql + " OR ";
      }
    }
  }

  sql = sql + ";";
  console.log(sql);

  con.query(sql, function (err, result) {
    if (err) {
      throw err;
    } else {
      console.log(result);
      return result;
    }
  });
}

function get_saved_events(user_id){
  return new Promise(function(resolve, reject) {
    con.query(`SELECT * FROM ${db_name}.saved_events WHERE user_id = ${user_id};`, function (err, result) {
      if (err) {
        return reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

function add_event(name, description, city, zip, street, house_number, address_additional, instagram_hashtag, verification_status = 0, start_date, end_date, event_link, ticket_link){
  return new Promise(function(resolve, reject) {
    var sql = `INSERT INTO event_finder.events (name, description, city, zip, street, house_number, address_additional, instagram_hashtag, verification_status, start_date, end_date, event_link, ticket_link, event_type, times_reported) VALUES ('${name}', '${description}', '${city}', '${zip}', '${street}', '${house_number}', '${address_additional}', '${instagram_hashtag}', '${verification_status}', '${start_date}', '${end_date}', '${event_link}', '${ticket_link}', '${event_type}');`;
    con.query(sql, function (err, result) {
      if (err) {
        return reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

get_saved_events(1).then(function(rows){
  a = rows;
});

function tokenize(phrase){
  phrase =  phrase.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()@\+\?><\[\]\+]*/g, '');
  phrase =  phrase.replace(/\s+/g, " ");
  return phrase.split(" ");
}
// get_events("12.12.2018","31.12.2018",null, "TOLLES        Event!?&", null);
// console.log(get_saved_events(1));


// add_comment(2,1, "wow toll");




//#################Unused Helpful Code Snippets#################################
// // disconnect from database
// con.end(function(err) {
//   if (err) throw err;
//   console.log("Disconnected from database.");
// });
