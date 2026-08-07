import { apiClient } from './axios';

// 1. 타입(Interface) 정의


// 희망 시간 단위 (예: 특정 날짜 및 시간대)
export interface AvailabilitySlot {
  startTime: string; // ISO 8601 string (예: '2026-08-10T14:00:00')
  endTime: string;   // ISO 8601 string (예: '2026-08-10T18:00:00')
}

// 팀 희망 시간 요약 정보
export interface TeamAvailabilitySummary {
  userId: number;
  userName?: string;
  availabilities: AvailabilitySlot[];
}


// 2. API 호출 함수 작성

/**
 * [PUT] 내 희망 시간 전체 교체 (제출/수정)
 * @param teamId 팀 ID
 * @param availabilities 내가 선택한 희망 시간 목록
 */
export const updateMyAvailabilities = async (
  teamId: number,
  availabilities: AvailabilitySlot[]
) => {
  // PUT /api/v1/teams/{teamId}/availabilities
  const response = await apiClient.put<{ message: string }>(
    `/api/v1/teams/${teamId}/availabilities`,
    { availabilities }
  );
  return response.data; // Ok 응답
};

/**
 * [GET] 팀원 전체 희망 시간 요약 조회
 * @param teamId 팀 ID
 */
export const getTeamAvailabilities = async (teamId: number) => {
  // GET /api/v1/teams/{teamId}/availabilities
  const response = await apiClient.get<{ data: TeamAvailabilitySummary[]; message: string }>(
    `/api/v1/teams/${teamId}/availabilities`
  );
  return response.data.data;
};