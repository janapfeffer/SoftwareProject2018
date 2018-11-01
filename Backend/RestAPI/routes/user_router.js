const express = require("express");
const router = express.Router();
const UserController = require('../controllers/user_controller');
const checkAuth = require('../middleware/check_auth');

router.post("/signup", UserController.user_signup);

router.post("/saveEvent", UserController.add_to_saved_events);

router.post("/login", UserController.user_login);
//
// router.delete("/:userId", checkAuth, UserController.user_delete);

module.exports = router;
