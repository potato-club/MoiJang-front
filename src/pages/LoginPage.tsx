import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
 
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
         <p className="text-gray-700">
          간편하고 쉬운 일정 조율</p>
        <h1 className="text-6xl font text-[#27D55B] mb-2">모이장</h1>
      </div>

      {/* 로그인 버튼 영역 */}
      <div className="w-full max-w-sm">
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-white border border-gray-100 text-gray-700 py-3.5 rounded-xl shadow-sm hover:bg-gray-50 font-semibold flex items-center justify-center gap-2 transition"
        >
          Google로 계속하기 
        </button>
      </div>
    </div>
  );
};

export default LoginPage;