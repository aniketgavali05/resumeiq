import api from '@/lib/api';

export interface NotificationResponse {
  id: number;
  title: string;
  description: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

const notificationService = {
  async getMyNotifications(): Promise<NotificationResponse[]> {
    const response =
      await api.get<NotificationResponse[]>(
        '/notifications'
      );

    return response.data;
  },

  async getUnreadCount(): Promise<number> {
    const response =
      await api.get<{ count: number }>(
        '/notifications/unread-count'
      );

    return response.data.count;
  },

  async markAsRead(
    id: number
  ): Promise<NotificationResponse> {
    const response =
      await api.put<NotificationResponse>(
        `/notifications/${id}/read`
      );

    return response.data;
  },

  async markAllAsRead(): Promise<void> {
    await api.put('/notifications/read-all');
  },

  async deleteNotification(
    id: number
  ): Promise<void> {
    await api.delete(
      `/notifications/${id}`
    );
  },
};

export default notificationService;