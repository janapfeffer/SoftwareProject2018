const express = require("express");
const router = express.Router();
const EventTypesController =  require("../controllers/event_types_controller");

router.get("/", EventTypesController.get_event_types);
router.post("/", EventTypesController.post_event_types);


module.exports = router;
