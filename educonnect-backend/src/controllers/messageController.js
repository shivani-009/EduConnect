import Message from '../models/Message.js';
import mongoose from 'mongoose';

export async function sendMessage(req, res) {
  try {
    const { recipientId, text } = req.body;
    if (!recipientId || !text) return res.status(400).json({ message: 'recipientId and text are required' });
    const message = await Message.create({ sender: req.user._id, recipient: recipientId, text });
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: 'Failed to send message' });
  }
}

export async function getConversation(req, res) {
  try {
    const otherId = req.params.userId;
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, recipient: otherId },
        { sender: otherId, recipient: req.user._id },
      ],
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch conversation' });
  }
}

export async function getConversations(req, res) {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const results = await Message.aggregate([
      { $match: { $or: [{ sender: userId }, { recipient: userId }] } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: { $cond: [{ $eq: ['$sender', userId] }, '$recipient', '$sender'] },
          lastMessage: { $first: '$text' },
          lastAt: { $first: '$createdAt' },
          unread: {
            $sum: { $cond: [{ $and: [{ $eq: ['$recipient', userId] }, { $eq: ['$read', false] }] }, 1, 0] },
          },
        },
      },
      { $sort: { lastAt: -1 } },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'partner',
        },
      },
      { $unwind: '$partner' },
      {
        $project: {
          _id: 1,
          lastMessage: 1,
          lastAt: 1,
          unread: 1,
          'partner.fullName': 1,
          'partner.avatar': 1,
          'partner.role': 1,
        },
      },
    ]);
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch conversations' });
  }
}
