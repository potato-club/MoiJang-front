import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 친구 데이터 타입 정의
interface Friend {
  id: number;
  name: string;
  email: string;
  profileImageUrl?: string;
  statusMessage?: string;
}

const FriendPage = () => {
  const navigate = useNavigate();

  // 1. 친구 목록 상태 (더미 데이터)
  const [friends, setFriends] = useState<Friend[]>([
    {
      id: 1,
      name: '홍길동',
      email: 'gildong@gmail.com',
    },
    {
      id: 2,
      name: '김모이',
      email: 'moi_kim@kakao.com',
    },
    {
      id: 3,
      name: '이코딩',
      email: 'coding_lee@naver.com',
    },
  ]);

  // 2. 입력 및 검색 상태
  const [addFriendInput, setAddFriendInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // 3. 친구 추가 핸들러
  const handleAddFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addFriendInput.trim()) {
      setMessage({ type: 'error', text: '친구의 이메일이나 아이디를 입력해 주세요.' });
      return;
    }

    const exists = friends.some((f) => f.email === addFriendInput.trim());
    if (exists) {
      setMessage({ type: 'error', text: '이미 친구 목록에 있는 사용자입니다.' });
      return;
    }

    // TODO: 백엔드 친구 요청 API 연동
    setMessage({
      type: 'success',
      text: `'${addFriendInput}' 님에게 친구 요청을 보냈습니다!`,
    });
    setAddFriendInput('');

    setTimeout(() => setMessage(null), 3000);
  };

  // 4. 친구 삭제 핸들러
  const handleDeleteFriend = (id: number, name: string) => {
    if (window.confirm(`${name} 님을 친구 목록에서 삭제하시겠습니까?`)) {
      setFriends((prev) => prev.filter((f) => f.id !== id));
    }
  };

  // 5. 내 친구 검색 필터링
  const filteredFriends = friends.filter(
    (friend) =>
      friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      {/* 전체 메인 카드 컨테이너 */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col gap-6">
        
        {/* 상단 헤더 */}
        <header className="flex items-center justify-between pb-2 border-b border-gray-100">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-gray-500 hover:text-gray-800 p-1.5 rounded-full hover:bg-gray-100 transition active:scale-95"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-bold text-gray-800">친구 관리</h1>
          <div className="w-8" />
        </header>

        {/* 상단: 새 친구 추가 섹션 */}
        <section className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="text-base">➕</span>
            <h2 className="text-sm font-bold text-gray-800">새 친구 추가</h2>
          </div>
          
          <form onSubmit={handleAddFriend} className="flex gap-2">
            <input
              type="text"
              value={addFriendInput}
              onChange={(e) => setAddFriendInput(e.target.value)}
              placeholder="이메일 또는 사용자 아이디"
              className="flex-1 px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#27D55B] focus:ring-1 focus:ring-[#27D55B] transition"
            />
            {/* 요청 버튼 (색상: #27D55B) */}
            <button
              type="submit"
              style={{ backgroundColor: '#27D55B' }}
              className="px-4 py-2.5 hover:opacity-90 active:scale-95 text-white text-xs font-bold rounded-xl transition shadow-sm whitespace-nowrap"
            >
              요청
            </button>
          </form>

          {/* 피드백 메시지 */}
          {message && (
            <p
              className={`text-xs ${
                message.type === 'success' ? 'text-[#27D55B] font-medium' : 'text-red-500'
              }`}
            >
              {message.text}
            </p>
          )}
        </section>

        {/* 하단: 내 친구 목록 섹션 */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-800">
              내 친구 <span style={{ color: '#27D55B' }}>{friends.length}</span>
            </h2>
          </div>

          {/* 친구 검색 입력창 */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 text-sm">
              🔍
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="친구 이름 또는 이메일 검색"
              className="w-full pl-9 pr-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:bg-white focus:border-[#27D55B] transition"
            />
          </div>

          {/* 친구 리스트 */}
          <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
            {filteredFriends.length > 0 ? (
              filteredFriends.map((friend) => (
                <div
                  key={friend.id}
                  className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-2xl hover:border-gray-200 hover:shadow-xs transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* 프로필 아바타 (배경 및 텍스트 컬러 조정) */}
                    <div
                      style={{ backgroundColor: 'rgba(39, 213, 91, 0.12)', color: '#27D55B' }}
                      className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shrink-0"
                    >
                      {friend.profileImageUrl ? (
                        <img
                          src={friend.profileImageUrl}
                          alt={friend.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        friend.name.slice(0, 1)
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold text-gray-800 truncate">
                        {friend.name}
                      </span>
                      <span className="text-xs text-gray-400 truncate">
                        {friend.statusMessage || friend.email}
                      </span>
                    </div>
                  </div>

                  {/* 삭제 버튼 */}
                  <button
                    type="button"
                    onClick={() => handleDeleteFriend(friend.id, friend.name)}
                    className="p-1.5 text-gray-300 hover:text-red-500 rounded-lg hover:bg-red-50 transition active:scale-90"
                    title="친구 삭제"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              ))
            ) : (
              <div className="py-10 text-center text-gray-400 text-xs flex flex-col items-center gap-1">
                <span>💬</span>
                <span>일치하는 친구가 없습니다.</span>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default FriendPage;