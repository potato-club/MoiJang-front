import React from 'react';

const MyPage = () => {
  // 버튼 클릭 핸들러 (기능 구현 시 채워넣을 부분)
  const handleBack = () => history.back(); // 뒤로가기
  const handleLogout = () => alert("로그아웃 하시겠습니까?");
  const handleWithdraw = () => alert("정말 회원탈퇴 하시겠습니까?");

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* 상단 헤더 */}
      <header className="max-w-md mx-auto flex items-center mb-8">
        <button onClick={handleBack} className="text-xl mr-4">⬅️</button>
        <h1 className="text-xl font-bold text-gray-800">내 정보</h1>
      </header>

      <main className="max-w-md mx-auto space-y-6">
        {/* 프로필 섹션 */}
        <div className="bg-white p-6 rounded-3xl shadow-sm flex items-center gap-4">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-2xl">👤</div>
          <div>
            <h2 className="font-bold text-lg">사용자님</h2>
            <p className="text-gray-500 text-sm">user@email.com</p>
          </div>
        </div>

        {/* 메뉴 리스트 */}
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
          <button 
            onClick={handleLogout}
            className="w-full text-left p-6 hover:bg-gray-50 transition border-b border-gray-100 font-medium"
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