const express = require("express");
const router = express.Router();
const EventTypesController = require("../controllers/event_type_controller");

router.get("/", EventTypesController.get_event_types);
router.get("/", EventTypesController.get_event_type);

module.exports = router;
