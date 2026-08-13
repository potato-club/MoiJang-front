import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMonthSchedules, type ScheduleResponse } from '../api/scheduleApi';

// 백엔드 미연동 시 테스트용 더미(임시) 일정 데이터
const DUMMY_SCHEDULES: ScheduleResponse[] = [
  {
    id: 101,
    title: '디자인 팀 미팅',
    content: '화상 회의 진행 (Google Meet)',
    startDate: '2026-08-10T14:00:00',
    endDate: '2026-08-10T16:00:00',
    color: '#F97316',
  },
  {
    id: 102,
    title: '모이장 백엔드 스터디',
    content: 'OAuth2 및 DB 구조 검토',
    startDate: '2026-08-12T19:00:00',
    endDate: '2026-08-12T21:00:00',
    color: '#3B82F6',
  },
  {
    id: 103,
    title: '중간 점검 발표 준비',
    content: 'PPT 자료 및 시연 시나리오 정리',
    startDate: '2026-08-13T10:00:00',
    endDate: '2026-08-13T12:00:00',
    color: '#10B981',
  },
  {
    id: 104,
    title: '프론트엔드 UI 최종 점검',
    content: '컴포넌트 리팩토링',
    startDate: '2026-08-15T16:00:00',
    endDate: '2026-08-15T18:00:00',
    color: '#F97316',
  },
];

// 타임라인 표시 시간대 (00:00 ~ 24:00 총 25개 시각 포인트)
const HOURS = Array.from({ length: 25 }, (_, i) => i);

const MainPage = () => {
  const navigate = useNavigate();

  // 1. 현재 연도 및 월/날짜
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  // 2. 뷰 모드 ('month' | 'week')
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');

  // 3. 서버/임시 일정 데이터
  const [schedules, setSchedules] = useState<ScheduleResponse[]>(DUMMY_SCHEDULES);
  const [loading, setLoading] = useState(false);

  // 4. 선택된 날짜 관리 (클릭 시 토글)
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);

  // 헤더 버튼 핸들러
  const handleProfile = () => navigate('/mypage');
  const handleRefresh = () => window.location.reload();
  const handleNotification = () => navigate('/notifications');
  const handleAddRoom = () => navigate('/room-create');

  // 일정 추가 버튼 클릭 핸들러
  const handleAddSchedule = () => {
    alert(`${selectedDateStr} 날짜에 새 일정을 추가하는 기능이야!`);
  };

  // 이전 / 다음 월/주 이동
  const handlePrev = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(year, month - 2, 1));
    } else {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() - 7);
      setCurrentDate(newDate);
    }
  };

  const handleNext = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(year, month, 1));
    } else {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + 7);
      setCurrentDate(newDate);
    }
  };

  // 날짜 클릭 시 토글 핸들러
  const handleDateClick = (dateString: string) => {
    if (selectedDateStr === dateString) {
      setSelectedDateStr(null);
    } else {
      setSelectedDateStr(dateString);
    }
  };

  // 백엔드 API 호출 (실패 시 더미 데이터 유지)
  useEffect(() => {
    const fetchSchedules = async () => {
      setLoading(true);
      try {
        const data = await getMonthSchedules(year, month);
        if (data && data.length > 0) {
          setSchedules(data);
        } else {
          setSchedules(DUMMY_SCHEDULES);
        }
      } catch (error) {
        console.warn('백엔드 미연동 상태: 임시(더미) 데이터를 사용합니다.');
        setSchedules(DUMMY_SCHEDULES);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [year, month]);

  // 선택된 날짜의 일정 목록
  const selectedDaySchedules = selectedDateStr
    ? schedules.filter((s) => s.startDate.startsWith(selectedDateStr))
    : [];

  // 현재 주간 일요일 기준 7일 날짜 배열 계산
  const getWeekDates = () => {
    const currentDayOfWeek = currentDate.getDay();
    const sunday = new Date(currentDate);
    sunday.setDate(currentDate.getDate() - currentDayOfWeek);

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(sunday);
      d.setDate(sunday.getDate() + i);
      return d;
    });
  };

  const weekDates = getWeekDates();

  // [월(Month) 뷰 렌더링]
  const renderMonthDays = () => {
    const days = [];
    const today = new Date();
    const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
    const lastDateOfMonth = new Date(year, month, 0).getDate();

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-12 opacity-0"></div>);
    }

    for (let day = 1; day <= lastDateOfMonth; day++) {
      const formattedMonth = String(month).padStart(2, '0');
      const formattedDay = String(day).padStart(2, '0');
      const dateString = `${year}-${formattedMonth}-${formattedDay}`;

      const isToday =
        today.getFullYear() === year &&
        today.getMonth() + 1 === month &&
        today.getDate() === day;

      const isSelected = selectedDateStr === dateString;
      const daySchedules = schedules.filter((s) => s.startDate.startsWith(dateString));
      const hasSchedule = daySchedules.length > 0;

      days.push(
        <div
          key={`month-${day}`}
          onClick={() => handleDateClick(dateString)}
          className={`h-12 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition active:scale-95 ${
            isSelected
              ? 'bg-orange-100/80 ring-2 ring-orange-400'
              : 'hover:bg-gray-100/60'
          }`}
        >
          <span
            className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-semibold ${
              isToday
                ? 'bg-orange-500 text-white font-bold shadow-xs'
                : isSelected
                ? 'text-orange-600 font-bold'
                : 'text-gray-700'
            }`}
          >
            {day}
          </span>

          <div className="h-2 flex items-center justify-center gap-0.5 mt-0.5">
            {hasSchedule && (
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isSelected ? 'bg-orange-600' : 'bg-orange-500'
                }`}
              />
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 flex flex-col items-center">
      <div className="w-full max-w-md">
        
        {/* 상단 헤더 */}
        <header className="flex justify-between items-center mb-6">
          {/* 📌 [수정된 프로필 UI] 좌측 프로필 및 내 정보 보기 영역 */}
          <div 
            onClick={handleProfile}
            className="flex items-center gap-3 cursor-pointer p-1 pr-3 rounded-2xl hover:bg-gray-100/80 transition active:scale-95"
          >
            {/* 프로필 이미지 아이콘 */}
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 shrink-0 border border-orange-200">
              <svg 
                className="w-6 h-6 text-orange-400" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>

            {/* 이름, 안내 텍스트, 화살표 */}
            <div className="flex flex-col text-left">
              <span className="text-sm font-bold text-gray-800 flex items-center gap-0.5 leading-tight">
                김모이
                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </span>
              <span className="text-[11px] text-gray-400 mt-0.5">내 정보 보기</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleRefresh}
              className="text-2xl p-2 hover:bg-gray-200 rounded-full transition active:scale-95"
            >
              🔄
            </button>
            <button
              onClick={handleNotification}
              className="text-2xl p-2 hover:bg-gray-200 rounded-full transition active:scale-95"
            >
              🔔
            </button>
          </div>
        </header>

        {/* 메인 달력 카드 */}
        <main className="bg-white rounded-3xl shadow-xs p-5">
          {/* 년/월 컨트롤 및 월/주 토글 */}
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-bold text-gray-800">
              {year}년 {month}월
            </h2>

            <div className="flex items-center gap-3">
              {/* 월 / 주 토글 스위치 */}
              <div className="flex bg-gray-100 p-0.5 rounded-xl border border-gray-200 text-xs font-semibold">
                <button
                  onClick={() => setViewMode('month')}
                  className={`px-3 py-1 rounded-lg transition ${
                    viewMode === 'month'
                      ? 'bg-white text-orange-500 shadow-xs font-bold'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  월
                </button>
                <button
                  onClick={() => setViewMode('week')}
                  className={`px-3 py-1 rounded-lg transition ${
                    viewMode === 'week'
                      ? 'bg-white text-orange-500 shadow-xs font-bold'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  주
                </button>
              </div>

              {/* 이전 / 다음 화살표 */}
              <div className="flex gap-1">
                <button
                  onClick={handlePrev}
                  className="w-7 h-7 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-600 font-bold text-sm transition"
                >
                  &lt;
                </button>
                <button
                  onClick={handleNext}
                  className="w-7 h-7 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-600 font-bold text-sm transition"
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>

          {/* ------------------- [월 뷰 디스플레이] ------------------- */}
          {viewMode === 'month' ? (
            <>
              {/* 요일 라벨 */}
              <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-400 mb-3 py-1">
                <div className="text-red-400">일</div>
                <div>월</div>
                <div>화</div>
                <div>수</div>
                <div>목</div>
                <div>금</div>
                <div className="text-blue-400">토</div>
              </div>

              {/* 월 달력 그리드 */}
              <div className="grid grid-cols-7 text-center gap-y-1 gap-x-1">
                {renderMonthDays()}
              </div>
            </>
          ) : (
            /* ------------------- [주(Week) 뷰 타임라인] ------------------- */
            <div>
              {/* 상단 날짜 헤더 (좌측 시간축 1칸 + 7개 요일) */}
              <div className="grid grid-cols-8 text-center border-b border-gray-100 pb-2 mb-2">
                <div className="text-[10px] text-gray-400 flex items-center justify-center">
                  시간
                </div>
                {weekDates.map((d, i) => {
                  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
                  const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                  const isSelected = selectedDateStr === dateStr;
                  const isToday = new Date().toDateString() === d.toDateString();

                  return (
                    <div
                      key={i}
                      onClick={() => handleDateClick(dateStr)}
                      className={`cursor-pointer py-1 rounded-xl transition ${
                        isSelected ? 'bg-orange-100/70 font-bold' : ''
                      }`}
                    >
                      <div className={`text-[10px] ${i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-gray-400'}`}>
                        {dayNames[i]}
                      </div>
                      <div className={`text-xs font-bold mt-0.5 ${
                        isToday ? 'text-orange-500 underline' : 'text-gray-700'
                      }`}>
                        {d.getDate()}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 타임라인 그리드 (00:00 ~ 24:00 전체 스크롤 가능) */}
              <div className="max-h-80 overflow-y-auto pr-1 relative">
                <div className="grid grid-cols-8 relative border-t border-gray-50">
                  
                  {/* 좌측 시간축 칸 (00:00 ~ 24:00) */}
                  <div className="border-r border-gray-100">
                    {HOURS.map((hour) => (
                      <div
                        key={hour}
                        className="h-10 text-[9px] text-gray-400 text-center -mt-2 pr-1"
                      >
                        {String(hour).padStart(2, '0')}:00
                      </div>
                    ))}
                  </div>

                  {/* 7개 요일별 타임라인 컬럼 */}
                  {weekDates.map((d, colIdx) => {
                    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                    const daySchedules = schedules.filter((s) => s.startDate.startsWith(dateStr));

                    return (
                      <div
                        key={colIdx}
                        onClick={() => handleDateClick(dateStr)}
                        className="relative border-r border-gray-50 last:border-r-0 cursor-pointer"
                      >
                        {/* 00:00 ~ 24:00 가로 가이드선 (19칸 생성) */}
                        {HOURS.slice(0, 19).map((hour) => (
                          <div
                            key={hour}
                            className="h-10 border-b border-gray-100/60"
                          />
                        ))}

                        {/* 일정 타임 블록 (불렛저널/시간대별 박스 렌더링) */}
                        {daySchedules.map((schedule) => {
                          const start = new Date(schedule.startDate);
                          const end = new Date(schedule.endDate);

                          const startHour = start.getHours();
                          const startMin = start.getMinutes();
                          const endHour = end.getHours();
                          const endMin = end.getMinutes();

                          // 00:00 기준으로 위치 및 높이 계산 (1시간 = 30px)
                          const topMinutes = startHour * 60 + startMin;
                          const durationMinutes = (endHour - startHour) * 60 + (endMin - startMin);

                          const top = (topMinutes / 60) * 30;
                          const height = Math.max((durationMinutes / 60) * 30, 20); // 최소 높이 보장

                          return (
                            <div
                              key={schedule.id}
                              className="absolute left-0.5 right-0.5 rounded-md p-1 text-[9px] text-white font-semibold overflow-hidden shadow-2xs transition hover:opacity-90 flex flex-col justify-start leading-tight"
                              style={{
                                top: `${top}px`,
                                height: `${height}px`,
                                backgroundColor: schedule.color || '#F97316',
                              }}
                            >
                              <div className="truncate font-bold">
                                {schedule.title}
                              </div>
                              <div className="text-[8px] opacity-90 truncate mt-0.5">
                                {String(startHour).padStart(2, '0')}:{String(startMin).padStart(2, '0')}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </main>

        {/* 하단 영역 */}
        <section className="mt-6">
          {selectedDateStr ? (
            /* [일정 목록 카드 + 오른쪽에 일정 추가 버튼] */
            <div className="bg-white rounded-3xl p-5 shadow-xs border border-orange-200">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-orange-500 rounded-full" />
                  <h3 className="font-bold text-gray-800 text-base">
                    {selectedDateStr} 일정
                  </h3>
                </div>

                {/* 📌 오른쪽 상단 버튼 그룹: 일정 추가 버튼 & 닫기 버튼 */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAddSchedule}
                    className="text-xs bg-orange-500 text-white font-semibold px-3 py-1.5 rounded-xl hover:bg-orange-600 transition active:scale-95 shadow-xs"
                  >
                    + 일정 추가
                  </button>
                  <button
                    onClick={() => setSelectedDateStr(null)}
                    className="text-xs text-gray-400 hover:text-gray-600 bg-gray-100 px-2.5 py-1.5 rounded-xl transition"
                  >
                    닫기 ✕
                  </button>
                </div>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {selectedDaySchedules.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-6">
                    이 날짜에 등록된 일정이 없습니다.
                  </p>
                ) : (
                  selectedDaySchedules.map((schedule) => (
                    <div
                      key={schedule.id}
                      className="p-3.5 rounded-2xl border border-gray-100 bg-orange-50/40 flex items-start gap-3"
                    >
                      <div
                        className="w-1.5 h-10 rounded-full shrink-0 mt-0.5"
                        style={{ backgroundColor: schedule.color || '#F97316' }}
                      />
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800 text-sm">
                          {schedule.title}
                        </h4>
                        {schedule.content && (
                          <p className="text-xs text-gray-500 mt-1">
                            {schedule.content}
                          </p>
                        )}
                        <p className="text-[10px] text-gray-400 mt-1.5 font-medium">
                          🕒 {schedule.startDate.split('T')[1]?.substring(0, 5)} ~{' '}
                          {schedule.endDate.split('T')[1]?.substring(0, 5)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            /* [기존 방 목록 영역] */
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800">방 목록</h3>
                <button
                  onClick={handleAddRoom}
                  className="text-sm bg-orange-500 text-white px-4 py-1.5 rounded-xl font-medium shadow-md hover:bg-orange-600 transition active:scale-95"
                >
                  추가
                </button>
              </div>

              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-16 bg-white rounded-xl shadow-xs border border-gray-100 p-4 flex items-center justify-between hover:border-orange-200 transition cursor-pointer"
                  >
                    <span className="font-semibold text-gray-700">모임 방 {item}</span>
                    <span className="text-xs text-orange-500 font-medium bg-orange-50 px-2.5 py-1 rounded-lg">
                      참여 중
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

export default MainPage;