const mongoose = require("mongoose");
const express = require("express");
const routes = require ("../Backend/RestAPI/routes/routes");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const app = express();
mongoose.Promise = global.Promise;

//Connecting to database
mongoose.connect (
    "mongodb+srv://SCRAM_user:"+
    "EventFinder2018"+
    "@eventfinder-pm15u.mongodb.net/test?retryWrites=true",
    {
        useNewUrlParser:true
    }).catch(err=> {
    console.error("ERROR", err.stack);
});

//using environment setup packages
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**Give Access to any client for this API, disables CORS, accepted request headers
 * 
 */

app.use((req, res, next) => {
    //Allowed origins, * means all
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      //Allowed headers
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    //Options-Request from Browser
    if (req.method === "OPTIONS") {
    //Our response to the browser: allowed http methods
      res.header("Access-Control-Allow-Methods", "PUT, POST, UPDATE, DELETE, GET");
      return res.status(200).json({});
    }
    /** next() has to be called at end of middleware, 
     * so that requests are allowed to pass after passing this middleware 
    */
    next();
});

//Middleware: Connects to routes
app.use("/event_type", routes);

app.get('/', function(req, res){
    res.send('hello world');
}); 

//Error handling
//404 Error 
app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

//other Errors
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
      error: {
        message: error.message
      }
    });
});

//Server connection to port 3000
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

  module.exports = app;