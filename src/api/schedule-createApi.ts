// src/api/scheduleApi.ts에 추가
import { apiClient } from './axios';

export interface ScheduleCreateRequest {
  title: string;
  content?: string;
  startDate: string; // ISO-8601 형식: 'YYYY-MM-DDTHH:mm:ss'
  endDate: string;   // ISO-8601 형식: 'YYYY-MM-DDTHH:mm:ss'
  color?: string;
}

/**
 * [POST] 새 일정 등록 API
 */
export const scheduleCreate = async (scheduleData: ScheduleCreateRequest) => {
  const response = await apiClient.post<{ data: unknown; message: string }>(
    '/api/v1/schedules',
    scheduleData
  );
  return response.data.data;
};