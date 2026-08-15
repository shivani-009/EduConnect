import api from './api';

export async function getConversations() {
  const res = await api.get('/messages');
  return res.data;
}

export async function getConversation(userId) {
  const res = await api.get(`/messages/${userId}`);
  return res.data;
}

export async function sendMessage(recipientId, text) {
  const res = await api.post('/messages', { recipientId, text });
  return res.data;
}
