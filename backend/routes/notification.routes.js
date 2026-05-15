const express = require("express");
const router = express.Router();
const { getNotifications, readNotification, readAllNotifications } = require("../controllers/notificationController");
const auth = require("../middlewares/authMiddleware");

router.get("/", auth, getNotifications);
router.patch("/:id/read", auth, readNotification);
router.patch("/read-all", auth, readAllNotifications);

module.exports = router;
