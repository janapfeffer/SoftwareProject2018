const mongoose = require("mongoose");
const express = require("express");
const routes = require ("../Backend/RestAPI/routes/routes");
const morgan = require("morgan");
const bodyParser = require("body-parser");

mongoose.Promise = global.Promise;

var app = express();

mongoose.connect (
    "mongodb+srv://SCRAM_user:"+
    "EventFinder2018"+
    "@eventfinder-pm15u.mongodb.net/test?retryWrites=true",
    {
        useNewUrlParser:true
    }).catch(err=> {
    console.error("ERROR", err.stack);
});

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
      return res.status(200).json({});
    }
    next();
});

app.use("/event_type", routes);
app.use("/events", routes);

app.get('/', function(req, res){
    res.send('hello world');
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

  module.exports = app;
