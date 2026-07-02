import React from 'react';
import { useNavigate } from 'react-router-dom';

const RoomCreatePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* 헤더 */}
      <header className="max-w-md mx-auto mb-8">
        <button onClick={() => navigate(-1)} className="text-xl">
          ⬅️
        </button>
      </header>

      {/* 방 생성 폼 */}
      <main className="max-w-md mx-auto space-y-4">
        <input type="text" placeholder="방 이름" className="w-full p-4 border border-gray-300 rounded-xl outline-none focus:border-orange-500" />
        <input type="number" placeholder="최대 인원 수 :" className="w-full p-4 border border-gray-300 rounded-xl outline-none focus:border-orange-500" />
        
        <select className="w-full p-4 border border-gray-300 rounded-xl outline-none text-gray-400">
          <option>방 종류: 단일 일정 / 정기 일정</option>
          <option>단일 일정</option>
          <option>정기 일정</option>
        </select>
        
        <input type="text" placeholder="내 닉네임:" className="w-full p-4 border border-gray-300 rounded-xl outline-none focus:border-orange-500" />
        <select className="w-full p-4 border border-gray-300 rounded-xl outline-none text-gray-400">
          <option>방 비밀번호(공개 or 비공개 선택)</option>
          <option>공개</option>
          <option>비공개</option>
        </select>
        <input type="text" placeholder="방 비밀번호" className="w-full p-4 border border-gray-300 rounded-xl outline-none focus:border-orange-500" />

        {/* 생성 버튼 */}
        <button 
          onClick={() => alert("방 생성 기능 준비 중이야!")}
          className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold text-lg shadow-md hover:bg-orange-600 transition active:scale-95 mt-8"
        >
          방 생성
        </button>
      </main>
    </div>
  );
};

export default RoomCreatePage;