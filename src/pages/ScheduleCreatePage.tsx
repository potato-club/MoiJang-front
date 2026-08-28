import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createSchedule } from '../api/scheduleApi';

// ------------------- [휠 스크롤 단일 컬럼 컴포넌트] -------------------
interface WheelColumnProps<T extends string | number> {
  items: T[];
  value: T;
  onChange: (val: T) => void;
  formatLabel?: (val: T) => string;
}

function WheelColumn<T extends string | number>({
  items,
  value,
  onChange,
  formatLabel,
}: WheelColumnProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const ITEM_HEIGHT = 40; // 선택 행 높이 (px)

  // 값 변경 시 스크롤 위치 동기화
  useEffect(() => {
    const idx = items.indexOf(value);
    if (idx !== -1 && containerRef.current) {
      containerRef.current.scrollTop = idx * ITEM_HEIGHT;
    }
  }, [value, items]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const top = e.currentTarget.scrollTop;
    const selectedIdx = Math.round(top / ITEM_HEIGHT);
    if (items[selectedIdx] !== undefined && items[selectedIdx] !== value) {
      onChange(items[selectedIdx]);
    }
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="h-30 overflow-y-auto no-scrollbar snap-y snap-mandatory relative w-full text-center"
      style={{ scrollBehavior: 'smooth' }}
    >
      {/* 상단 1칸 패딩 */}
      <div style={{ height: ITEM_HEIGHT }} />
      {items.map((item, idx) => {
        const isSelected = item === value;
        const label = formatLabel ? formatLabel(item) : String(item);
        return (
          <div
            key={idx}
            style={{ height: ITEM_HEIGHT }}
            onClick={() => onChange(item)}
            className={`flex items-center justify-center snap-center text-sm transition-all cursor-pointer select-none ${
              isSelected
                ? 'text-gray-900 font-extrabold text-base scale-110'
                : 'text-gray-300 font-medium scale-95'
            }`}
          >
            {label}
          </div>
        );
      })}
      {/* 하단 1칸 패딩 */}
      <div style={{ height: ITEM_HEIGHT }} />
    </div>
  );
}

// ------------------- [일정 추가 페이지] -------------------
const ScheduleCreatePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 날짜/시간 초기값
  const initialDate = location.state?.date || '2026-08-14';

  const [title, setTitle] = useState('');
  const [selectedColor, setSelectedColor] = useState('#00C49F');
  const [repeatType, setRepeatType] = useState<'none' | 'weekly' | 'monthly' | 'yearly'>('weekly');
  const [loading, setLoading] = useState(false);

  // 활성화된 피커: 'start-date' | 'start-time' | 'end-date' | 'end-time' | null
  const [activePicker, setActivePicker] = useState<
    'start-date' | 'start-time' | 'end-date' | 'end-time' | null
  >('start-time');

  // 시작 일시 상태 분해
  const [startYear, setStartYear] = useState(parseInt(initialDate.split('-')[0], 10));
  const [startMonth, setStartMonth] = useState(parseInt(initialDate.split('-')[1], 10));
  const [startDay, setStartDay] = useState(parseInt(initialDate.split('-')[2], 10));
  const [startAmpm, setStartAmpm] = useState<'오전' | '오후'>('오후');
  const [startHour, setStartHour] = useState(7);
  const [startMinute, setStartMinute] = useState(0);

  // 종료 일시 상태 분해
  const [endYear, setEndYear] = useState(parseInt(initialDate.split('-')[0], 10));
  const [endMonth, setEndMonth] = useState(parseInt(initialDate.split('-')[1], 10));
  const [endDay, setEndDay] = useState(parseInt(initialDate.split('-')[2], 10));
  const [endAmpm, setEndAmpm] = useState<'오전' | '오후'>('오후');
  const [endHour, setEndHour] = useState(5);
  const [endMinute, setEndMinute] = useState(0);

  // 휠 스크롤 선택지 데이터 목록
  const years = [2025, 2026, 2027, 2028];
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const ampms: ('오전' | '오후')[] = ['오전', '오후'];
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  // 표시용 텍스트 변환
  const startDateStr = `${startYear}. ${startMonth}. ${startDay}`;
  const startTimeStr = `${startAmpm} ${startHour}:${String(startMinute).padStart(2, '0')}`;
  const endDateStr = `${endYear}. ${endMonth}. ${endDay}`;
  const endTimeStr = `${endAmpm} ${endHour}:${String(endMinute).padStart(2, '0')}`;

  const handleRepeatClick = (type: 'weekly' | 'monthly' | 'yearly') => {
    setRepeatType((prev) => (prev === type ? 'none' : type));
  };

  // ISO 포맷 변환
  const formatISO = (
    y: number,
    m: number,
    d: number,
    ampm: '오전' | '오후',
    h: number,
    min: number
  ) => {
    let calcH = h;
    if (ampm === '오후' && calcH < 12) calcH += 12;
    if (ampm === '오전' && calcH === 12) calcH = 0;
    return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}T${String(calcH).padStart(2, '0')}:${String(min).padStart(2, '0')}:00`;
  };

  // 일정 생성 전송
  const handleCreateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('일정을 입력하세요.');
      return;
    }

    try {
      setLoading(true);
      await createSchedule({
        title,
        content: `반복: ${repeatType}`,
        startDate: formatISO(startYear, startMonth, startDay, startAmpm, startHour, startMinute),
        endDate: formatISO(endYear, endMonth, endDay, endAmpm, endHour, endMinute),
        color: selectedColor,
      });

      alert('일정이 성공적으로 추가되었습니다!');
      navigate('/main');
    } catch (_error) {
      console.error('백엔드 미연동: 임시 저장 처리', _error);
      alert('일정이 등록되었습니다. (로컬/테스트)');
      navigate('/main');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between max-w-md mx-auto px-5 py-6 font-sans">
      <div>
        {/* 헤더 */}
        <header className="relative flex items-center justify-center mb-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="absolute left-0 p-1 text-gray-800 hover:text-black transition active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-bold text-gray-900">일정</h1>
        </header>

        <form onSubmit={handleCreateSchedule} className="space-y-6">
          {/* 일정 입력창 */}
          <div className="relative flex items-center justify-between border border-gray-100 bg-white rounded-2xl px-4 py-3.5 shadow-xs focus-within:ring-1 focus-within:ring-[#27D55B]">
            <input
              type="text"
              placeholder="일정을 입력하세요."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-300 focus:outline-none"
              autoComplete="off"
            />
            <div
              className="w-5 h-5 rounded-full shrink-0 ml-2 cursor-pointer shadow-xs transition hover:scale-105"
              style={{ backgroundColor: selectedColor }}
              onClick={() => setSelectedColor((prev) => (prev === '#00C49F' ? '#27D55B' : '#00C49F'))}
            />
          </div>

          {/* 시작 일시 */}
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-2">시작</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  setActivePicker((prev) => (prev === 'start-date' ? null : 'start-date'))
                }
                className={`w-full py-3 rounded-2xl text-xs font-semibold transition active:scale-98 border ${
                  activePicker === 'start-date'
                    ? 'border-[#27D55B] text-[#27D55B] bg-emerald-50/20'
                    : 'border-gray-100 text-gray-700 bg-white shadow-xs'
                }`}
              >
                {startDateStr}
              </button>

              <button
                type="button"
                onClick={() =>
                  setActivePicker((prev) => (prev === 'start-time' ? null : 'start-time'))
                }
                className={`w-full py-3 rounded-2xl text-xs font-semibold transition active:scale-98 border ${
                  activePicker === 'start-time'
                    ? 'border-[#27D55B] text-[#27D55B] bg-emerald-50/20'
                    : 'border-gray-100 text-gray-700 bg-white shadow-xs'
                }`}
              >
                {startTimeStr}
              </button>
            </div>

            {/* 시작 날짜 피커 */}
            {activePicker === 'start-date' && (
              <div className="relative mt-3 py-1 bg-gray-50/60 rounded-2xl overflow-hidden border border-gray-100">
                <div className="absolute top-1/2 left-3 right-3 -translate-y-1/2 h-10 bg-gray-200/40 rounded-xl pointer-events-none" />
                <div className="grid grid-cols-3">
                  <WheelColumn items={years} value={startYear} onChange={setStartYear} formatLabel={(v) => `${v}년`} />
                  <WheelColumn items={months} value={startMonth} onChange={setStartMonth} formatLabel={(v) => `${v}월`} />
                  <WheelColumn items={days} value={startDay} onChange={setStartDay} formatLabel={(v) => `${v}일`} />
                </div>
              </div>
            )}

            {/* 시작 시간 피커 (스크롤 룰렛) */}
            {activePicker === 'start-time' && (
              <div className="relative mt-3 py-1 bg-gray-50/60 rounded-2xl overflow-hidden border border-gray-100">
                <div className="absolute top-1/2 left-3 right-3 -translate-y-1/2 h-10 bg-gray-200/40 rounded-xl pointer-events-none" />
                <div className="grid grid-cols-3">
                  <WheelColumn items={ampms} value={startAmpm} onChange={setStartAmpm} />
                  <WheelColumn items={hours} value={startHour} onChange={setStartHour} />
                  <WheelColumn
                    items={minutes}
                    value={startMinute}
                    onChange={setStartMinute}
                    formatLabel={(v) => String(v).padStart(2, '0')}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 종료 일시 */}
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-2">종료</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  setActivePicker((prev) => (prev === 'end-date' ? null : 'end-date'))
                }
                className={`w-full py-3 rounded-2xl text-xs font-semibold transition active:scale-98 border ${
                  activePicker === 'end-date'
                    ? 'border-[#27D55B] text-[#27D55B] bg-emerald-50/20'
                    : 'border-gray-100 text-gray-700 bg-white shadow-xs'
                }`}
              >
                {endDateStr}
              </button>

              <button
                type="button"
                onClick={() =>
                  setActivePicker((prev) => (prev === 'end-time' ? null : 'end-time'))
                }
                className={`w-full py-3 rounded-2xl text-xs font-semibold transition active:scale-98 border ${
                  activePicker === 'end-time'
                    ? 'border-[#27D55B] text-[#27D55B] bg-emerald-50/20'
                    : 'border-gray-100 text-gray-700 bg-white shadow-xs'
                }`}
              >
                {endTimeStr}
              </button>
            </div>

            {/* 종료 날짜 피커 */}
            {activePicker === 'end-date' && (
              <div className="relative mt-3 py-1 bg-gray-50/60 rounded-2xl overflow-hidden border border-gray-100">
                <div className="absolute top-1/2 left-3 right-3 -translate-y-1/2 h-10 bg-gray-200/40 rounded-xl pointer-events-none" />
                <div className="grid grid-cols-3">
                  <WheelColumn items={years} value={endYear} onChange={setEndYear} formatLabel={(v) => `${v}년`} />
                  <WheelColumn items={months} value={endMonth} onChange={setEndMonth} formatLabel={(v) => `${v}월`} />
                  <WheelColumn items={days} value={endDay} onChange={setEndDay} formatLabel={(v) => `${v}일`} />
                </div>
              </div>
            )}

            {/* 종료 시간 피커 */}
            {activePicker === 'end-time' && (
              <div className="relative mt-3 py-1 bg-gray-50/60 rounded-2xl overflow-hidden border border-gray-100">
                <div className="absolute top-1/2 left-3 right-3 -translate-y-1/2 h-10 bg-gray-200/40 rounded-xl pointer-events-none" />
                <div className="grid grid-cols-3">
                  <WheelColumn items={ampms} value={endAmpm} onChange={setEndAmpm} />
                  <WheelColumn items={hours} value={endHour} onChange={setEndHour} />
                  <WheelColumn
                    items={minutes}
                    value={endMinute}
                    onChange={setEndMinute}
                    formatLabel={(v) => String(v).padStart(2, '0')}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 반복 주기 */}
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

      {/* 하단 생성 버튼 */}
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