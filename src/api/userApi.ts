import { apiClient } from './axios';

// 유저 프로필 데이터 타입
export interface UserProfileResponse {
  id: number;
  email: string;
  name?: string;
  profileImageUrl?: string;
}

/**
 * [GET] 내 프로필 정보 조회
 */
export const getMyProfile = async () => {
  // GET /api/v1/users/me
  const response = await apiClient.get<{ data: UserProfileResponse; message: string }>(
    '/api/v1/users/me'
  );
  return response.data.data;
};