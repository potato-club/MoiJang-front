import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotificationPage = () => {
  const navigate = useNavigate();

  const handleBack = () => navigate('/main'); // 메인으로 돌아가기

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* 상단 헤더 */}
      <header className="max-w-md mx-auto flex items-center mb-8">
        <button onClick={handleBack} className="text-xl mr-4">⬅️</button>
        <div>
          <h1 className="text-xl font-bold text-gray-800">알림</h1>
          <p className="text-xs text-gray-400">방 초대, 친구 추가 수락 and 거절</p>
        </div>
      </header>

      <main className="max-w-md mx-auto space-y-8">
        {/* 어제 섹션 */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 mb-3 ml-1">어제</h2>
          <div className="space-y-3">
            <NotificationItem text="소영 님이 친구 추가를..." type="accept" />
            <NotificationItem text="감자 방에 초대 요청이.." type="accept" />
          </div>
        </section>

        {/* 최근 7일 섹션 */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 mb-3 ml-1">최근 7일</h2>
          <div className="space-y-3">
            <NotificationItem text="고구마 수락 완료 창" type="check" />
            <NotificationItem text="고구마 님이 친구 추가를..." type="accept" />
          </div>
        </section>
      </main>
    </div>
  );
};

// 알림 항목 컴포넌트
const NotificationItem = ({ text, type }: { text: string; type: 'accept' | 'check' }) => (
  <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between border border-gray-100">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-gray-100 rounded-full"></div>
      <span className="text-sm font-medium text-gray-700">{text}</span>
    </div>
    <div className="flex gap-2">
      <button className="px-3 py-1 text-sm bg-orange-100 text-orange-600 rounded-lg font-medium hover:bg-orange-200 transition">
        {type === 'accept' ? '수락' : 'V'}
      </button>
      <button className="text-gray-400 font-bold hover:text-red-500 transition">x</button>
    </div>
  </div>
);

export default NotificationPage;