import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTeam } from '../api/teamApi';

const RoomCreatePage = () => {
  const navigate = useNavigate();

  // 폼 입력 상태
  const [roomName, setRoomName] = useState('');
  const [maxMembers, setMaxMembers] = useState(4);
  const [scheduleType, setScheduleType] = useState<'단기 일정' | '정기 일정'>('단기 일정');
  const [nickname, setNickname] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // 방 생성 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!roomName.trim()) {
      alert('방 이름을 입력해주세요.');
      return;
    }

    if (!nickname.trim()) {
      alert('닉네임을 입력해주세요.');
      return;
    }

    if (!isPublic && !password.trim()) {
      alert('비공개 방은 비밀번호 입력이 필요합니다.');
      return;
    }

    setLoading(true);

    try {
      const result = await createTeam({
        name: roomName,
        password: isPublic ? undefined : password,
      });

      console.log('방 생성 성공:', result);
      alert(`'${roomName}' 방이 성공적으로 생성되었습니다!`);
      navigate('/main');
    } catch (error: any) {
      console.error('방 생성 실패:', error);
      alert(error?.response?.data?.errorMessage || '방 생성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between max-w-md mx-auto px-6 py-6 font-sans relative z-10">
      {/* 폼 전체를 form 태그로 감싸 이벤트 및 입력 정상 작동 보장 */}
      <form onSubmit={handleSubmit} className="flex flex-col justify-between min-h-full flex-1">
        <div>
          {/* 상단 헤더 */}
          <div className="flex items-center justify-between py-2 mb-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
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
            <h1 className="text-lg font-bold text-gray-900">방 생성</h1>
            <div className="w-6" />
          </div>

          <div className="space-y-6">
            {/* 1. 방 이름 (입력 가능하도록 활성화 및 텍스트 색상 명확화) */}
            <div>
              <label htmlFor="roomName" className="block text-sm font-semibold text-gray-800 mb-2">
                방 이름
              </label>
              <input
                id="roomName"
                type="text"
                placeholder="방 이름을 입력해주세요."
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-sm text-gray-900 bg-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 placeholder-gray-400 transition"
                autoComplete="off"
              />
            </div>

            {/* 2. 인원 선택 */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                인원 선택
              </label>
              <div className="grid grid-cols-7 gap-2">
                {[2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setMaxMembers(num)}
                    className={`py-3 rounded-xl border text-sm font-medium transition ${
                      maxMembers === num
                        ? 'border-green-500 text-green-600 bg-green-50 font-bold'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. 방 종류 */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                방 종류
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(['단기 일정', '정기 일정'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setScheduleType(type)}
                    className={`py-3.5 rounded-xl border text-sm font-medium transition ${
                      scheduleType === type
                        ? 'border-green-500 text-green-600 bg-green-50 font-bold'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. 닉네임 (입력 가능하도록 활성화) */}
            <div>
              <label htmlFor="nickname" className="block text-sm font-semibold text-gray-800 mb-2">
                닉네임
              </label>
              <input
                id="nickname"
                type="text"
                placeholder="닉네임을 입력해주세요."
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-sm text-gray-900 bg-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 placeholder-gray-400 transition"
                autoComplete="off"
              />
            </div>

            {/* 5. 공개 설정 */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                공개 설정
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsPublic(true)}
                  className={`py-3.5 rounded-xl border text-sm font-medium transition ${
                    isPublic
                      ? 'border-green-500 text-green-600 bg-green-50 font-bold'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  공개
                </button>
                <button
                  type="button"
                  onClick={() => setIsPublic(false)}
                  className={`py-3.5 rounded-xl border text-sm font-medium transition ${
                    !isPublic
                      ? 'border-green-500 text-green-600 bg-green-50 font-bold'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  비공개
                </button>
              </div>
            </div>

            {/* 6. 비공개 설정 시 나타나는 방 비밀번호 입력창 (활성화 완료) */}
            {!isPublic && (
              <div className="pt-1 relative z-20">
                <label htmlFor="roomPassword" className="block text-sm font-semibold text-gray-800 mb-2">
                  방 비밀번호
                </label>
                <input
                  id="roomPassword"
                  type="password"
                  placeholder="비밀번호를 입력해주세요."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-sm text-gray-900 bg-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 placeholder-gray-400 transition"
                  autoComplete="new-password"
                />
              </div>
            )}
          </div>
        </div>

        {/* 하단 생성 버튼 */}
        <div className="pt-8 pb-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-2xl font-bold text-base shadow-sm transition active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            {loading ? '생성 중...' : '생성하기'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RoomCreatePage;