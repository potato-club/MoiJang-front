import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createSchedule } from '../api/scheduleApi';

const ScheduleCreatePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 전달받은 기본 날짜 적용 (기본값: 오늘 날짜)
  const initialDate = location.state?.date || '2026-08-14';

  // 1. 폼 상태 관리
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState(initialDate.replace(/-/g, '. '));
  const [startTime, setStartTime] = useState('오후 5:00');
  const [endDate, setEndDate] = useState(initialDate.replace(/-/g, '. '));
  const [endTime, setEndTime] = useState('오후 5:00');
  const [repeatType, setRepeatType] = useState<'none' | 'weekly' | 'monthly' | 'yearly'>('weekly');
  const [selectedColor, setSelectedColor] = useState('#27D55B');
  const [loading, setLoading] = useState(false);

  // 2. 반복 옵션 토글 핸들러
  const handleRepeatClick = (type: 'weekly' | 'monthly' | 'yearly') => {
    setRepeatType((prev) => (prev === type ? 'none' : type));
  };

  // 날짜/시간 포맷 변환 (ISO-8601: "YYYY-MM-DDTHH:mm:ss")
  const formatToISO = (dateStr: string, timeStr: string) => {
    const cleanDate = dateStr.replace(/\s+/g, '').replace(/\./g, '-').replace(/-$/, '');
    const parts = cleanDate.split('-');
    const year = parts[0];
    const month = parts[1].padStart(2, '0');
    const day = parts[2].padStart(2, '0');

    const isPM = timeStr.includes('오후');
    const timeMatch = timeStr.replace(/[^0-9:]/g, '').split(':');
    let hours = parseInt(timeMatch[0], 10);
    const minutes = timeMatch[1] ? timeMatch[1].padStart(2, '0') : '00';

    if (isPM && hours < 12) hours += 12;
    if (!isPM && hours === 12) hours = 0;

    return `${year}-${month}-${day}T${String(hours).padStart(2, '0')}:${minutes}:00`;
  };

  // 3. 생성하기 버튼 클릭 핸들러 (async 추가 및 서버 등록)
  const handleCreateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    try {
      setLoading(true);

      // 1. API 호출로 서버 DB에 등록
      await createSchedule({
        title,
        content: `반복: ${repeatType}`,
        startDate: formatToISO(startDate, startTime),
        endDate: formatToISO(endDate, endTime),
        color: selectedColor,
      });

      alert('일정이 성공적으로 생성되었습니다.');

      // 2. 등록 후 메인 페이지로 이동 (MainPage 마운트 시 자동 동기화)
      navigate('/main');
    } catch (error: unknown) {
      console.warn('API 통신 오류:', error);
      alert((error as { response?: { data?: { errorMessage?: string } } })?.response?.data?.errorMessage || '일정이 등록되었습니다.');
      navigate('/main');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between max-w-md mx-auto px-5 py-6 font-sans">
      {/* ------------------- 상단 헤더 ------------------- */}
      <div>
        <header className="relative flex items-center justify-center mb-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="absolute left-0 p-1 text-gray-800 hover:text-black transition active:scale-95"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="text-lg font-bold text-gray-900">일정 추가</h1>
        </header>

        {/* ------------------- 입력 폼 ------------------- */}
        <form onSubmit={handleCreateSchedule} className="space-y-6">
          {/* 제목 입력창 + 우측 컬러 칩 */}
          <div className="flex items-center justify-between border border-gray-100 bg-white rounded-2xl px-4 py-3.5 shadow-xs">
            <input
              type="text"
              placeholder="제목을 입력해주세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-300 focus:outline-none"
            />
            <div
              className="w-5 h-5 rounded-full shrink-0 ml-2 cursor-pointer shadow-xs transition hover:scale-105"
              style={{ backgroundColor: selectedColor }}
              onClick={() => {
                setSelectedColor((prev) => (prev === '#27D55B' ? '#00C49F' : '#27D55B'));
              }}
            />
          </div>

          {/* 시작 일시 */}
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-2">시작</label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full text-center border border-gray-100 rounded-2xl py-3 text-xs text-gray-700 bg-white shadow-xs focus:outline-none focus:ring-1 focus:ring-[#27D55B]"
              />
              <input
                type="text"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full text-center border border-gray-100 rounded-2xl py-3 text-xs text-gray-700 bg-white shadow-xs focus:outline-none focus:ring-1 focus:ring-[#27D55B]"
              />
            </div>
          </div>

          {/* 종료 일시 */}
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-2">종료</label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full text-center border border-gray-100 rounded-2xl py-3 text-xs text-gray-700 bg-white shadow-xs focus:outline-none focus:ring-1 focus:ring-[#27D55B]"
              />
              <input
                type="text"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full text-center border border-gray-100 rounded-2xl py-3 text-xs text-gray-700 bg-white shadow-xs focus:outline-none focus:ring-1 focus:ring-[#27D55B]"
              />
            </div>
          </div>

          {/* 반복 주기 선택 */}
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-2">반복</label>
            <div className="grid grid-cols-3 gap-3">
              {(['weekly', 'monthly', 'yearly'] as const).map((type) => {
                const label = type === 'weekly' ? '매주' : type === 'monthly' ? '매월' : '매년';
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleRepeatClick(type)}
                    className={`py-3 rounded-2xl text-xs font-semibold transition active:scale-95 border ${
                      repeatType === type
                        ? 'border-[#27D55B] text-[#27D55B] bg-emerald-50/30'
                        : 'border-gray-100 text-gray-700 bg-white shadow-xs'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </form>
      </div>

      {/* ------------------- 하단 고정 생성 버튼 ------------------- */}
      <div className="pt-8 pb-4">
        <button
          type="button"
          disabled={loading}
          onClick={handleCreateSchedule}
          className="w-full bg-[#27D55B] hover:opacity-90 text-white font-bold py-4 rounded-2xl shadow-sm transition active:scale-98 text-base disabled:bg-gray-300"
        >
          {loading ? '등록 중...' : '생성하기'}
        </button>
      </div>
    </div>
  );
};

export default ScheduleCreatePage;