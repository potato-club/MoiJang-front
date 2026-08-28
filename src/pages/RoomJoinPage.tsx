import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const RoomJoinPage = () => {
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();

  // 폼 입력 상태
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // 방 입장 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nickname.trim()) {
      alert('닉네임을 입력해주세요.');
      return;
    }

    setLoading(true);

    try {
      // 백엔드 API 호출 처리 위치 (예: joinTeam({ roomId, nickname, password }))
      console.log('방 입장 데이터:', { roomId, nickname, password });
      
      alert('방에 성공적으로 입장했습니다!');
      navigate(`/room/${roomId || '1'}`);
    } catch (error) {
      console.error('방 입장 실패:', error);
      alert((error as { response?: { data?: { errorMessage?: string } } })?.response?.data?.errorMessage || '방 입장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between max-w-md mx-auto px-6 py-6 font-sans relative">
      <form onSubmit={handleSubmit} className="flex flex-col justify-between min-h-full flex-1">
        <div>
          {/* 상단 헤더 */}
          <div className="flex items-center justify-between py-2 mb-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-gray-700 hover:text-black transition p-1 cursor-pointer"
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
            <h1 className="text-lg font-bold text-gray-900">방 입장</h1>
            <div className="w-6" /> {/* 좌우 균형 맞춤용 빈 공간 */}
          </div>

          <div className="space-y-6">
            {/* 1. 닉네임 */}
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
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-sm text-gray-900 bg-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 placeholder-gray-400 transition cursor-text pointer-events-auto"
                autoComplete="off"
              />
            </div>

            {/* 2. 방 비밀번호 */}
            <div>
              <label htmlFor="roomPassword" className="block text-sm font-semibold text-gray-800 mb-2">
                방 비밀번호
              </label>
              <input
                id="roomPassword"
                type="password"
                placeholder="비밀번호를 입력해주세요."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-sm text-gray-900 bg-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 placeholder-gray-400 transition cursor-text pointer-events-auto"
                autoComplete="current-password"
              />
            </div>
          </div>
        </div>

        {/* 하단 입장하기 버튼 */}
        <div className="pt-8 pb-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-2xl font-bold text-base shadow-sm transition active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            {loading ? '입장 중...' : '입장하기'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RoomJoinPage;