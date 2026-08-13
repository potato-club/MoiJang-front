import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// userApi.ts에 정의된 getMyProfile 함수 및 UserProfileResponse 타입 불러오기
import { getMyProfile, type UserProfileResponse } from '../api/userApi';

const MyPage = () => {
  const navigate = useNavigate();

  // 1. 프로필 상태 및 로딩 상태 관리
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // 2. 화면에 진입할 때 내 프로필 정보 가져오기
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMyProfile(); // getMyProfile 함수 호출
        setProfile(data);
      } catch (error) {
        console.error('프로필 정보를 불러오는데 실패했습니다:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // 3. 뒤로가기 핸들러
  const handleBack = () => {
    navigate(-1);
  };

  // 4. 로그아웃 핸들러
  const handleLogout = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      localStorage.removeItem('accessToken'); // 저장된 토큰 삭제
      alert('로그아웃 되었습니다.');
      navigate('/'); // 로그인 화면으로 이동
    }
  };

  // 5. 회원탈퇴 핸들러
  const handleWithdraw = () => {
    if (window.confirm('정말 회원탈퇴 하시겠습니까? 계정 정보가 삭제됩니다.')) {
      alert('회원탈퇴 처리가 완료되었습니다.');
      localStorage.removeItem('accessToken');
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* 상단 헤더 */}
      <header className="max-w-md mx-auto flex items-center mb-8 gap-3">
        <button
          type="button"
          onClick={handleBack}
          className="text-gray-700 hover:text-black transition p-1"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-gray-800">내 정보</h1>
      </header>

      <main className="max-w-md mx-auto space-y-6">
        {/* 프로필 섹션 */}
        <div className="bg-white p-6 rounded-3xl shadow-sm flex items-center gap-4">
          {/* 프로필 이미지 혹은 기본 이모지 */}
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-2xl overflow-hidden shrink-0">
            {profile?.profileImageUrl ? (
              <img
                src={profile.profileImageUrl}
                alt="프로필 이미지"
                className="w-full h-full object-cover"
              />
            ) : (
              '👤'
            )}
          </div>

          <div>
            {loading ? (
              <p className="text-gray-400 text-sm">프로필 불러오는 중...</p>
            ) : (
              <>
                <h2 className="font-bold text-lg text-gray-800">
                  {profile?.name || '사용자님'}
                </h2>
                <p className="text-gray-500 text-sm">
                  {profile?.email || '이메일 정보 없음'}
                </p>
              </>
            )}
          </div>
        </div>

        {/* 메뉴 리스트 */}
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
          <button
            onClick={handleLogout}
            className="w-full text-left p-6 hover:bg-gray-50 transition border-b border-gray-100 font-medium text-gray-700"
          >
            로그아웃
          </button>
          <button
            onClick={handleWithdraw}
            className="w-full text-left p-6 hover:bg-gray-50 transition text-red-500 font-medium"
          >
            회원탈퇴
          </button>
        </div>
      </main>
    </div>
  );
};

export default MyPage;