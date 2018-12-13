const express = require("express");
const router = express.Router();
const UserController = require('../controllers/user_controller');
const checkAuth = require('../middleware/check_auth');

router.post("/signup", UserController.user_signup);
router.post("/login", UserController.user_login);

//protected routes
router.post("/unsaveEvent", checkAuth, UserController.delete_saved_event);
router.get("/:userId/events", checkAuth, UserController.get_saved_events);
router.get("/:userId/saved_events_ids", checkAuth, UserController.get_saved_events_ids);
router.post("/saveEvent", checkAuth, UserController.add_to_saved_events);
router.get("/ownedEvents", checkAuth, UserController.get_owned_events);

//only used for testing
router.delete("/:userId", UserController.user_delete);

module.exports = router;
