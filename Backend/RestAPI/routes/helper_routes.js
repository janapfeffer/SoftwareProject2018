const express = require("express");
const router = express.Router();
const EventTypesController = require("../helpers.js");

router.get("/", EventTypesController.get_event_types);
router.post("/", EventTypesController.post_event_types);


module.exports = router;