import Notification from '../models/Notification.js';

export async function getNotifications(req, res) {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
}

export async function markRead(req, res) {
  try {
    const n = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { read: true },
      { new: true }
    );
    if (!n) return res.status(404).json({ message: 'Notification not found' });
    res.json(n);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update notification' });
  }
}

export async function deleteNotification(req, res) {
  try {
    await Notification.deleteOne({ _id: req.params.id, user: req.user._id });
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete notification' });
  }
}

export async function clearAll(req, res) {
  try {
    await Notification.deleteMany({ user: req.user._id });
    res.json({ cleared: true });
  } catch (err) {
    res.status(500).json({ message: 'Failed to clear notifications' });
  }
}
