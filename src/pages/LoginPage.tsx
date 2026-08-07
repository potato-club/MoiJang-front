import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate(); //백엔드 연결 전까지 테스트용으로 바로 메인화면으로 이동
  
  /*const [searchParams] = useSearchParams(); 
  useSearchParams -> 백엔드가 구글 인가를 마치고 프론트를 리다이렉트시킬 때, URL 쿼리 파라미터에 실려오는 토큰을 읽음
  
  1.백엔드에서 리다이렉트되어 돌아왔을 때 URL의 토큰을 감지하고 처리하는 로직
  useEffect(() => {
    const token = searchParams.get('token'); //URL 쿼리 파라미터에서 토큰 값 추출 (?token=...) 
    ***구글 인증 완료 시 백엔드가 프론트로 리다이렉트 시키는 URL파라미터명이 ?token= 이 맞는지 확인 필요***
    ***token인지 accessToken인지 확인 필요***
   
    if (token) {
      받아온 토큰을 로컬 스토리지에 보관
      localStorage.setItem('accessToken', token);
        
      토큰 보관 후 곧바로 메인 페이지로 이동
      navigate('/main', { replace: true });
    }
  }, [searchParams, navigate]);
  */
 
  //2.구글 로그인 버튼 클릭 핸들러
  const handleGoogleLogin = () => {
    // ⚠️ 백엔드의 OAuth2 로그인 진입점 주소로 화면을 아예 이동시킴
    // window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    
    navigate('/main'); //프론트 단독 테스트용 
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4 font-sans">
      
      {/* 타이틀 영역 */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-2">MOIJANG</h1>
        <p className="text-gray-500">
          모이장으로 모이장</p>
      </div>

      {/* 로그인 버튼 영역 */}
      <div className="w-full max-w-sm">
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-white border border-gray-300 text-gray-700 py-3.5 rounded-xl shadow-sm hover:bg-gray-50 font-semibold flex items-center justify-center gap-2 transition"
        >
          {/* 구글 G 로고 아이콘 */}
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          구글 계정으로 계속하기 
        </button>
      </div>
    </div>
  );
};

export default LoginPage;