const express = require("express");
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');
// const checkAuth = require('../middleware/check-auth');
const EventController = require('../controllers/event_controller');

// picture upload: START
// storage strategy: allows to adjust how files get stored
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  // define name under which pic is stored
  filename: function(req, file, cb) {
    //2018-10-25T10:04:01.873Zoriginalname.jpg
    cb(null, new Date().toISOString() + file.originalname);
  }
});

// only accept certain file types: jpeg and png
const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    // could return error here
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5 // = 5MB
  }
});
// picture upload: END


// routes
router.post("/", upload.single('eventImage'), EventController.create_event);
router.get("/",  EventController.get_events);

module.exports = router;
