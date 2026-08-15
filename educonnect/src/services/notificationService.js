import api from './api';

export async function getNotifications() {
  const res = await api.get('/notifications');
  return res.data;
}

export async function markNotificationRead(id) {
  const res = await api.patch(`/notifications/${id}/read`);
  return res.data;
}

export async function deleteNotification(id) {
  const res = await api.delete(`/notifications/${id}`);
  return res.data;
}

export async function clearAllNotifications() {
  const res = await api.delete('/notifications');
  return res.data;
}
