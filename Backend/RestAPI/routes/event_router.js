const express = require("express");
const router = express.Router();
const EventController = require("../controllers/event_controller");

router.get("/", EventController.get_all_events);
router.post("/", EventController.create_event);


module.exports = router;