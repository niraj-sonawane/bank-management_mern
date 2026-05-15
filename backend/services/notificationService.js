const Notification = require("../models/Notification");

const createNotification = async ({ userId, message, type }) => {
  return Notification.create({
    userId,
    message,
    type,
  });
};

const getUserNotifications = async (userId) => {
  return Notification.find({ userId }).sort({ createdAt: -1 }).limit(20);
};

const markAsRead = async (notificationId, userId) => {
  return Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { isRead: true },
    { new: true }
  );
};

const markAllAsRead = async (userId) => {
  return Notification.updateMany({ userId }, { isRead: true });
};

module.exports = {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
};
