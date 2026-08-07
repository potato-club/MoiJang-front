import { apiClient } from './axios';

// 알림 항목 타입
export interface NotificationItem {
  id: number;
  message: string;
  type: string; // 예: 'TEAM_INVITE'
  createdAt: string;
}

/**
 * [GET] 알림 목록 조회
 */
export const getNotifications = async () => {
  // GET /api/v1/notifications
  const response = await apiClient.get<{ data: NotificationItem[]; message: string }>(
    '/api/v1/notifications'
  );
  return response.data.data;
};

/**
 * [POST] 알림 수락 (예: 팀 초대 수락)
 * @param id 알림 ID
 */
export const acceptNotification = async (id: number) => {
  // POST /api/v1/notifications/{id}/accept
  const response = await apiClient.post<{ message: string }>(
    `/api/v1/notifications/${id}/accept`
  );
  return response.data;
};

/**
 * [POST] 알림 거절
 * @param id 알림 ID
 */
export const rejectNotification = async (id: number) => {
  // POST /api/v1/notifications/{id}/reject
  const response = await apiClient.post<{ message: string }>(
    `/api/v1/notifications/${id}/reject`
  );
  return response.data;
};