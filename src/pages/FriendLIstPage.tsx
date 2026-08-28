import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface FriendItem {
  id: number;
  name: string;
  avatarBg: string; // 아바타 배경색 (파랑, 초록, 주황 등)
  isNewSearch?: boolean; // 검색된 추가 대상 여부 //true일 때만 우측에 추가 버튼 나타남
}

const FriendListPage = () => {
  const navigate = useNavigate();

  // 1. 검색어 상태
  const [searchTerm, setSearchTerm] = useState('홍길동');

  // 2. 검색 결과 및 기존 친구 리스트
  const [friends, setFriends] = useState<FriendItem[]>([
    {
      id: 1,
      name: '홍길동',
      avatarBg: '#007AFF', // 파란색
      isNewSearch: true,

    },
    {
      id: 2,
      name: '지수',
      avatarBg: '#27D55B', // 초록색
      isNewSearch: true,
    },
    {
      id: 3,
      name: '김이박',
      avatarBg: '#FFB800', // 주황색
    },
    {
      id: 4,
      name: '철수',
      avatarBg: '#27D55B', // 초록색
    },
  ]);

  // 3. 친구 추가 핸들러
  const handleAddFriend = (id: number, name: string) => {
    alert(`${name} 님에게 친구 요청을 보냈습니다.`);
    // 추가 후 버튼 상태 변경 처리
    setFriends((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isNewSearch: false } : item)) 
      //'추가'버튼을 클릭하면 요청 알림을 띄우고, 해당 아이템의 isNewSearch 값을 false로 변경하여 버튼이 사라지도록 처리
    );
  };

  //4. 검색어 기반 필터링
  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      {/* 모바일 뷰 컨테이너 */}
      <div className="w-full max-w-[390px] min-h-[750px] bg-white rounded-[40px] shadow-lg border border-gray-200 p-6 flex flex-col">
        
        {/* 상단 상태바 영역 (여백) */}
        <div className="h-4" />

        {/* 1. 상단 헤더 */}
        <header className="relative flex items-center justify-center py-2 mb-4">
          <button
            type="button"
            onClick={() => navigate(-1)} 
            className="absolute left-0 p-1 text-gray-700 hover:text-black transition active:scale-95"
            aria-label="뒤로가기"
          >
            <svg
              className="w-5 h-5 stroke-[2.5]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-base font-bold text-gray-900 tracking-tight">친구 목록</h1>
        </header>

        {/* 2. 상단 검색창 */}
        <div className="relative mb-6">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="친구 검색"
            className="w-full pl-10 pr-4 py-2.5 bg-[#F2F3F5] rounded-xl text-sm text-gray-800 placeholder-gray-400 outline-none focus:bg-white focus:ring-1 focus:ring-gray-300 transition"
          />
        </div>

        {/* 3. 친구 리스트 */}
        <div className="flex flex-col gap-5 flex-1 overflow-y-auto pr-1">
          {filteredFriends.map((friend) => (
            <div key={friend.id} className="flex items-center justify-between">
              {/* 좌측 아바타 + 이름 */}
              <div className="flex items-center gap-3.5">
                <div
                  style={{ backgroundColor: friend.avatarBg }}
                  className="w-11 h-11 rounded-full flex items-center justify-center text-white text-base font-medium shrink-0 select-none shadow-xs"
                >
                  {friend.name.charAt(0)}
                </div>
                <span className="text-[15px] font-medium text-gray-900">
                  {friend.name}
                </span>
              </div>

              {/* 우측 추가 버튼 (검색 결과에 해당하는 대상일 때 표시) */}
              {friend.isNewSearch && (
                <button
                  type="button"
                  onClick={() => handleAddFriend(friend.id, friend.name)}
                  className="bg-[#27D55B] hover:opacity-90 active:scale-95 text-white text-xs font-medium px-3.5 py-1.5 rounded-lg transition"
                >
                  추가
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FriendListPage;