import { apiClient } from './axios';

// 1. 타입(Interface) 정의


// 일정 생성/수정 요청 시 보낼 데이터 타입
export interface ScheduleRequest {
  title: string;
  content?: string;
  startDate: string; // ISO 8601 string (예: '2026-08-07T10:00:00')
  endDate: string;   // ISO 8601 string (예: '2026-08-07T12:00:00')
  color?: string;    // 색상 코드 (예: '#FF5733')
}

// 백엔드에서 받아올 일정 데이터 타입
export interface ScheduleResponse {
  id: number;
  title: string;
  content?: string;
  startDate: string;
  endDate: string;
  color?: string;
}


// 2. API 호출 함수 작성
/**
 * [GET] 월별 일정 조회
 * @param year 년도 (예: 2026)
 * @param month 월 (예: 8)
 */

export const getMonthSchedules = async (year: number, month: number) => {
  // GET /api/v1/schedules?year=2026&month=8
  const response = await apiClient.get<{ data: ScheduleResponse[]; message: string }>(
    '/api/v1/schedules',
    {
      params: { year, month },
    }
  );
  // 백엔드의 Success<T> 응답 구조 { data: [...], message: "..." } 에서 진짜 데이터 배열만 반환
  return response.data.data;
};

/**
 * [POST] 새 일정 등록
 * @param scheduleData 일정 등록 정보
 */
export const createSchedule = async (scheduleData: ScheduleRequest) => {
  // POST /api/v1/schedules
  const response = await apiClient.post<{ data: ScheduleResponse; message: string }>(
    '/api/v1/schedules',
    scheduleData
  );
  return response.data.data;
};

/**
 * [PUT] 일정 수정
 * @param id 수정할 일정 ID
 * @param scheduleData 수정할 일정 정보
 */
export const updateSchedule = async (id: number, scheduleData: ScheduleRequest) => {
  // PUT /api/v1/schedules/{id}
  const response = await apiClient.put<{ data: ScheduleResponse; message: string }>(
    `/api/v1/schedules/${id}`,
    scheduleData
  );
  return response.data.data;
};

/**
 * [DELETE] 일정 삭제
 * @param id 삭제할 일정 ID
 */
export const deleteSchedule = async (id: number) => {
  // DELETE /api/v1/schedules/{id}
  const response = await apiClient.delete<{ message: string }>(
    `/api/v1/schedules/${id}`
  );
  return response.data; // Ok 응답 { message: "..." }
};