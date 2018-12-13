const express = require("express");
const multer = require("multer");
const router = express.Router();
const EventController = require("../controllers/event_controller");
const checkAuth = require('../middleware/check_auth');

// picture upload: START
// storage strategy: allows to adjust how files get stored
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "event_images/");
  },
  // define name under which pic is stored
  filename: function(req, file, cb) {
    //2018-10-25T10:04:01.873Zoriginalname.jpg
    cb(null, new Date().toISOString().replace(/:/g, '-') + "_" + file.originalname);
  }
});

// only accept certain file types: jpeg and png
const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
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
router.get("/filtered", EventController.get_filtered_events);
router.get("/:eventId", EventController.get_event);

//protected routes with authentication
router.post("/", checkAuth, upload.single('event_picture'), EventController.create_event);
router.post("/addComment", checkAuth, EventController.add_comment);
router.post("/rate", checkAuth, EventController.event_rating);

//only used for testing
router.delete("/:eventId", checkAuth, EventController.delete_event);

//unused routes
// router.patch("/:eventId", checkAuth, EventController.update_event);
// router.post("/deleteComment", checkAuth, EventController.delete_comment);

module.exports = router;
