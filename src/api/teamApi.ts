import { apiClient } from './axios';

// 1. 타입(Interface) 정의

// 팀 생성 요청 데이터 타입
export interface CreateTeamRequest {
  name: string;
  password?: string;
}

// 팀 상세 정보 응답 타입
export interface TeamResponse {
  teamId: number;
  name: string;
  inviteCode: string;
  inviteLink: string;
}


// 2. API 호출 함수 작성

/**
 * [POST] 팀(소모임) 방 개설
 * @param teamData 팀 이름 및 비밀번호
 */
export const createTeam = async (teamData: CreateTeamRequest) => {
  // POST /api/v1/teams
  const response = await apiClient.post<{ data: TeamResponse; message: string }>(
    '/api/v1/teams',
    teamData
  );
  return response.data.data;
};

/**
 * [GET] 팀 상세 정보 조회 (초대코드/링크 포함)
 * @param teamId 팀 ID
 */
export const getTeamDetail = async (teamId: number) => {
  // GET /api/v1/teams/{teamId}
  const response = await apiClient.get<{ data: TeamResponse; message: string }>(
    `/api/v1/teams/${teamId}`
  );
  return response.data.data;
};

/**
 * [POST] 초대코드 + 비밀번호로 팀 가입
 * @param code 초대코드
 * @param password 팀 비밀번호
 */
export const joinTeam = async (code: string, password?: string) => {
  // POST /api/v1/teams/join?code=xxx&password=xxx
  const response = await apiClient.post<{ message: string }>(
    '/api/v1/teams/join',
    null,
    {
      params: { code, password },
    }
  );
  return response.data; // Ok 응답
};

/**
 * [DELETE] 팀 삭제
 * @param teamId 팀 ID
 */
export const deleteTeam = async (teamId: number) => {
  // DELETE /api/v1/teams/{teamId}
  const response = await apiClient.delete<{ message: string }>(
    `/api/v1/teams/${teamId}`
  );
  return response.data;
};