const { getUserNotifications, markAsRead, markAllAsRead } = require("../services/notificationService");

const getNotifications = async (req, res) => {
  try {
    const notifications = await getUserNotifications(req.user.id);
    return res.status(200).json(notifications);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

const readNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await markAsRead(id, req.user.id);
    return res.status(200).json(notification);
  } catch (error) {
    return res.status(500).json({ message: "Failed to mark notification as read" });
  }
};

const readAllNotifications = async (req, res) => {
  try {
    await markAllAsRead(req.user.id);
    return res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to mark all notifications as read" });
  }
};

module.exports = {
  getNotifications,
  readNotification,
  readAllNotifications,
};
