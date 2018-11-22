const express = require("express");
const router = express.Router();
const UserController = require('../controllers/user_controller');
const checkAuth = require('../middleware/check_auth');

router.post("/signup", UserController.user_signup);

router.post("/saveEvent", UserController.add_to_saved_events);

router.post("/login", UserController.user_login);

router.delete("/:userId",  UserController.user_delete);

router.post("/unsaveEvent", UserController.delete_saved_event);

router.get("/:userId/events",  UserController.get_saved_events);

router.get("/:userId/saved_events_ids", UserController.get_saved_events_ids);

module.exports = router;
