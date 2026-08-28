import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyProfile, type UserProfileResponse } from '../api/userApi';

const MyPage = () => {
  const navigate = useNavigate();

  // 1. 프로필 상태 및 로딩 상태 관리
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // 2. 화면 진입 시 내 프로필 정보 가져오기
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMyProfile();
        setProfile(data);
      } catch (error) {
        console.error('프로필 정보를 불러오는데 실패했습니다:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const displayName = profile?.name || '사용자';
  const avartaBgColor= '#27D55B'; 

  // 3. 뒤로가기 핸들러
  const handleBack = () => {
    navigate(-1);
  };

  // 4. 로그아웃 핸들러
  const handleLogout = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      localStorage.removeItem('accessToken');
      alert('로그아웃 되었습니다.');
      navigate('/');
    }
  };

  // 5. 회원탈퇴 핸들러
  const handleWithdraw = () => {
    if (window.confirm('정말 회원탈퇴 하시겠습니까? 계정 정보가 삭제됩니다.')) {
      localStorage.removeItem('accessToken');
      alert('회원탈퇴 처리가 완료되었습니다.');
      navigate('/');
    }
  };

  const handleFriends = () => {
    navigate('/friends');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center py-8 px-4">
      {/* 상단 헤더 */}
      <header className="w-full max-w-md relative flex items-center justify-center mb-8">
        <button
          type="button"
          onClick={handleBack}
          className="absolute left-0 text-gray-700 hover:text-black transition p-1"
          aria-label="뒤로가기"
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

      <main className="w-full max-w-md space-y-5">
        {/* 프로필 카드 (중앙 정렬) */}
        <div className="bg-white rounded-3xl p-8 shadow-sm flex flex-col items-center text-center border border-gray-100">
          {/* 아바타 이미지 */}
          <div className="flex items-center gap-3.5">
                <div
                  style={{ backgroundColor: avartaBgColor }}
                  className="w-11 h-11 rounded-full flex items-center justify-center text-white text-base font-medium shrink-0 select-none shadow-xs"
                >
                  {displayName.charAt(0)}
                </div>
          </div>

          {/* 사용자 정보 */}
          {loading ? (
            <p className="text-gray-400 text-sm py-2">프로필 불러오는 중...</p>
          ) : (
            <>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                {profile?.name || '사용자'}
              </h2>
              <p className="text-gray-400 text-sm">
                {profile?.email || 'user@example.com'}
              </p>
            </>
          )}
        </div>

        {/* 메뉴 리스트 카드 */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">

          {/* 친구목록 버튼 */}
          <button
            type="button"
            onClick={handleFriends}
            className="w-full flex items-center justify-between p-5 text-left font-medium text-gray-700 hover:bg-gray-50 transition active:bg-gray-100"
          >
            <span>친구목록</span>
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* 로그아웃 버튼 */}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-5 text-left font-medium text-gray-700 hover:bg-gray-50 transition active:bg-gray-100"
          >
            <span>로그아웃</span>
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* 회원탈퇴 버튼 */}
          <button
            type="button"
            onClick={handleWithdraw}
            className="w-full flex items-center justify-between p-5 text-left font-medium text-red-500 hover:bg-red-50/50 transition active:bg-red-100/50"
          >
            <span>회원탈퇴</span>
            <svg
              className="w-5 h-5 text-red-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </main>
    </div>
  );
};

export default MyPage;