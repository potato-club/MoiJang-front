import axios from 'axios';

// 1. 공통으로 사용할 Axios 인스턴스 생성
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. 요청 인터셉터 (Request Interceptor) 설정 - 백엔드로 요청을 보낼 때마다 자동으로 토큰을 실어주는 가로채기 로직
apiClient.interceptors.request.use(
  (config) => {
    // localStorage에서 저장된 JWT 토큰 꺼내기
    const token = localStorage.getItem('accessToken');

    // 토큰이 존재할 경우 요청 헤더의 Authorization 필드에 Bearer 토큰 주입
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error) // 요청 전 에러가 발생한 경우 처리
);