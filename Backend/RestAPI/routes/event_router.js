const express = require("express");
const multer = require ("multer");
const router = express.Router();
const EventController = require("../controllers/event_controller");

// picture upload: START
// storage strategy: allows to adjust how files get stored
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, "C:/Users/D067609/Documents/HS-LU/5. Semester/SE2/Eventfinder/SoftwareProject2018/Backend/event_images"); //muss relativ gemacht werden
    },
    // define name under which pic is stored
    filename: function(req, file, cb) {
      //2018-10-25T10:04:01.873Zoriginalname.jpg
      cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
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

router.get("/", EventController.get_all_events);
router.post("/", upload.single('event_picture'), EventController.create_event);

module.exports = router;
