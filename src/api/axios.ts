import axios from 'axios';

// 1. 공통으로 사용할 Axios 인스턴스 생성
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  // HttpOnly 쿠키 전송을 위해 필수 설정
  // 요청 시 브라우저가 쿠키(Set-Cookie로 받은 토큰)를 백엔드로 자동 포함하여 전송하도록 설정
});

// 2. 필요 시 응답 인터셉터 (Response Interceptor) 설정
// (인증 만료 등 401 에러 발생 시 로그인 페이지로 이동시키는 예외 처리 용도)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // 401 Unauthorized 에러 시 처리 (예: 로그인 페이지로 이동)
      // window.location.href = '/';
    }
    return Promise.reject(error);
  }
);