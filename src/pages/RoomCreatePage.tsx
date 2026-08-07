import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTeam } from '../api/teamApi';

const RoomCreatePage = () => {
  const navigate = useNavigate();

  // 1. 입력 폼 상태 관리 (UI 입력값 저장용)
  const [teamName, setTeamName] = useState('');
  const [maxMembers, setMaxMembers] = useState('');
  const [roomType, setRoomType] = useState('single'); // 'single' (단일) or 'regular' (정기)
  const [isPrivate, setIsPrivate] = useState(false); // 공개/비공개 선택
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // 2. 방 생성 폼 제출 핸들러
  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!teamName.trim()) {
      alert('방 이름을 입력해 주세요!');
      return;
    }

    if (isPrivate && !password.trim()) {
      alert('비공개 방은 비밀번호 입력이 필수입니다!');
      return;
    }

    setLoading(true);

    try {
      // teamApi.ts의 createTeam 함수 호출!
      const result = await createTeam({
        name: teamName,
        password: isPrivate ? password : undefined,
      });

      console.log('팀 생성 성공:', result);
      alert(`'${result.name}' 방이 성공적으로 생성되었습니다!`);

      // 생성 완료 후 메인 페이지로 이동
      navigate('/main');
    } catch (error: any) {
      console.error('팀 생성 실패:', error);
      alert(error?.response?.data?.errorMessage || '방 개설에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* 상단 헤더 */}
      <header className="max-w-md mx-auto mb-8">
        <button 
          onClick={() => navigate(-1)} 
          className="text-xl p-2 hover:bg-gray-200 rounded-lg transition"
        >
          ⬅️
        </button>
      </header>

      {/* 방 생성 폼 */}
      <main className="max-w-md mx-auto">
        <form onSubmit={handleCreateTeam} className="space-y-4">
          
          {/* 방 이름 (백엔드 name 필드와 연결) */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1">방 이름 *</label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="방 이름"
              className="w-full p-4 border border-gray-300 rounded-xl outline-none focus:border-orange-500 text-gray-800 bg-white"
            />
          </div>

          {/* 최대 인원 수 (UI용) */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1">최대 인원 수</label>
            <input
              type="number"
              placeholder="최대 인원 수"
              className="w-full p-4 border border-gray-300 rounded-xl outline-none focus:border-orange-500 text-gray-800 bg-white"
            />
          </div>

          {/* 방 종류 (UI용) */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1">방 종류</label>
            <select className="w-full p-4 border border-gray-300 rounded-xl outline-none text-gray-700 bg-white">
              <option value="single">단일 일정</option>
              <option value="regular">정기 일정</option>
            </select>
          </div>

          {/* 닉네임 (UI용) */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1">내 닉네임</label>
            <input
              type="text"
              placeholder="내 닉네임"
              className="w-full p-4 border border-gray-300 rounded-xl outline-none focus:border-orange-500 text-gray-800 bg-white"
            />
          </div>

          {/* 공개 / 비공개 선택 */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1">공개 여부</label>
            <select
              value={isPrivate ? 'private' : 'public'}
              onChange={(e) => setIsPrivate(e.target.value === 'private')}
              className="w-full p-4 border border-gray-300 rounded-xl outline-none text-gray-700 bg-white"
            >
              <option value="public">공개 방</option>
              <option value="private">비공개 방 (비밀번호 설정)</option>
            </select>
          </div>

          {/* 비공개 선택시에만 비밀번호 입력창 표시 (백엔드 password 필드와 연결) */}
          {isPrivate && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1">방 비밀번호 *</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="방 비밀번호 입력"
                className="w-full p-4 border border-gray-300 rounded-xl outline-none focus:border-orange-500 text-gray-800 bg-white"
              />
            </div>
          )}

          {/* 생성 버튼 */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold text-lg shadow-md hover:bg-orange-600 transition active:scale-95 disabled:bg-gray-300 mt-8"
          >
            {loading ? '방 생성 중...' : '방 생성'}
          </button>

        </form>
      </main>
    </div>
  );
};

export default RoomCreatePage;