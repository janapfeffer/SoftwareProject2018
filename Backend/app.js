const mongoose = require("mongoose");
const express = require("express");
const eventRoutes = require("../Backend/RestAPI/routes/event_router");
const eventtypeRoutes = require("../Backend/RestAPI/routes/event_types_router");
const userRoutes = require("../Backend/RestAPI/routes/user_router");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const app = express();

//Connecting to database
mongoose.connect(
  "mongodb+srv://SCRAM_user:" +
  "EventFinder2018" +
  "@eventfinder-pm15u.mongodb.net/test?retryWrites=true", {
    useNewUrlParser: true
  }).catch(err => {
  console.error("ERROR", err.stack);
});

//using environment setup packages
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use("/event_images", express.static("event_images"));
//Give Access to any client for this API, disables CORS, accepted request headers

app.use((req, res, next) => {
  //Allowed origins, * means all
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    //Allowed headers incl. custom headers
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, filter_start_date, filter_end_date, filter_event_type, authorization"
  );
  //Options-Request from Browser
  if (req.method === "OPTIONS") {
    //Our response to the browser: allowed http methods
    res.header("Access-Control-Allow-Methods", "PUT, POST, UPDATE, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

//Middleware: Connects to routes
app.use("/event_types", eventtypeRoutes);
app.use("/events", eventRoutes)
app.use("/user", userRoutes)

app.get('/', function(req, res) {
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
      message: error.message,
    }
  });
});

//Server connection to port 3000
app.listen(3000, function() {
  console.log('Node Server is listening on port 3000!');
});

module.exports = app;
