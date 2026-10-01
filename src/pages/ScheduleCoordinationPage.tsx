import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ScheduleCoordinationPage = () => {
  const navigate = useNavigate();

  const YEAR = 2026;

  const months = Array.from(
    { length: 12 },
    (_, index) => index + 1
  );

  const times = [
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
    '18:00',
    '18:30',
    '19:00',
    '19:30',
    '20:00',
    '20:30',
    '21:00',
    '21:30',
    '22:00',
  ];

  const [selectedMonth, setSelectedMonth] = useState(8);

  const [selectedDates, setSelectedDates] = useState<number[]>([]);

  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);

  // 기존에 저장된 내 일정이 있으면 불러오기
  useState(() => {
    const saved = localStorage.getItem('myScheduleAvailability');

    if (!saved) {
      return;
    }

    try {
      const schedule = JSON.parse(saved);

      if (schedule.month) {
        setSelectedMonth(schedule.month);
      }

      if (schedule.dates) {
        setSelectedDates(schedule.dates);
      }

      if (schedule.times) {
        setSelectedTimes(schedule.times);
      }
    } catch {
      console.log('저장된 일정 불러오기 실패');
    }
  });

  const getDaysInMonth = (month: number) => {
    return new Date(YEAR, month, 0).getDate();
  };

  const getFirstDay = (month: number) => {
    return new Date(
      YEAR,
      month - 1,
      1
    ).getDay();
  };

  const handleMonthClick = (month: number) => {
    setSelectedMonth(month);

    // 다른 월을 선택하면 날짜만 초기화
    setSelectedDates([]);
  };

  const handleDateClick = (date: number) => {
    if (selectedDates.includes(date)) {
      setSelectedDates((prev) =>
        prev.filter((item) => item !== date)
      );
    } else {
      setSelectedDates((prev) =>
        [...prev, date].sort((a, b) => a - b)
      );
    }
  };

  const handleTimeClick = (time: string) => {
    if (selectedTimes.includes(time)) {
      setSelectedTimes((prev) =>
        prev.filter((item) => item !== time)
      );
    } else {
      setSelectedTimes((prev) =>
        [...prev, time].sort()
      );
    }
  };

  const handleSubmit = () => {
    if (selectedDates.length === 0) {
      alert('가능한 날짜를 한 개 이상 선택해주세요.');
      return;
    }

    if (selectedTimes.length === 0) {
      alert('가능한 시간을 한 개 이상 선택해주세요.');
      return;
    }

    const sortedDates = [...selectedDates].sort(
      (a, b) => a - b
    );

    const sortedTimes = [...selectedTimes].sort();

    const dateText = sortedDates
      .map((date) => `${selectedMonth}월 ${date}일`)
      .join(', ');

    const timeText = sortedTimes.join(', ');

    const result = window.confirm(
      `선택한 일정으로 등록하시겠습니까?\n\n날짜: ${dateText}\n시간: ${timeText}`
    );

    if (!result) {
      return;
    }

    const mySchedule = {
      year: YEAR,
      month: selectedMonth,
      dates: sortedDates,
      times: sortedTimes,
    };

    // 현재는 프론트 테스트용 저장
    // 나중에는 이 부분을 백엔드 POST/PUT API로 교체
    localStorage.setItem(
      'myScheduleAvailability',
      JSON.stringify(mySchedule)
    );

    alert('일정이 등록되었습니다!');

    navigate('/schedule-overview');
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto w-full max-w-md">

        {/* 헤더 */}
        <header className="relative mb-8 flex items-center justify-center">
          <button
            type="button"
            onClick={() => navigate('/schedule-overview')}
            className="absolute left-0 flex h-9 w-9 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100"
            aria-label="뒤로가기"
          >
            <svg
              className="h-5 w-5"
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

          <h1 className="text-lg font-bold text-gray-900">
            내 일정 추가
          </h1>
        </header>

        {/* 설명 */}
        <section className="mb-6">
          <p className="mb-1 text-xs text-gray-400">
            동아리 정기 모임
          </p>

          <h2 className="text-xl font-bold text-gray-900">
            가능한 날짜를 선택해주세요
          </h2>

          <p className="mt-2 text-xs leading-5 text-gray-400">
            참여할 수 있는 날짜와 시간을 모두 선택해주세요.
          </p>
        </section>

        <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">

          {/* 월 선택 */}
          <div>
            <h3 className="mb-4 text-sm font-bold text-gray-800">
              월 선택
            </h3>

            <div className="flex gap-2 overflow-x-auto pb-2">
              {months.map((month) => {
                const selected =
                  selectedMonth === month;

                return (
                  <button
                    key={month}
                    type="button"
                    onClick={() =>
                      handleMonthClick(month)
                    }
                    className={`
                      h-10 w-12 shrink-0
                      rounded-xl
                      text-xs font-bold
                      transition
                      ${
                        selected
                          ? 'bg-[#27D55B] text-white'
                          : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                      }
                    `}
                  >
                    {month}월
                  </button>
                );
              })}
            </div>
          </div>

          <div className="my-6 border-t border-gray-100" />

          {/* 날짜 선택 */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-800">
                날짜 선택
              </h3>

              <span className="text-xs font-bold text-[#27D55B]">
                {selectedMonth}월
              </span>
            </div>

            {/* 요일 */}
            <div className="mb-2 grid grid-cols-7 gap-2 text-center">
              {[
                '일',
                '월',
                '화',
                '수',
                '목',
                '금',
                '토',
              ].map((day, index) => (
                <span
                  key={day}
                  className={`
                    text-[10px] font-medium
                    ${
                      index === 0
                        ? 'text-red-400'
                        : index === 6
                        ? 'text-blue-400'
                        : 'text-gray-400'
                    }
                  `}
                >
                  {day}
                </span>
              ))}
            </div>

            {/* 달력 */}
            <div className="grid grid-cols-7 gap-2">

              {/* 앞쪽 빈칸 */}
              {Array.from({
                length: getFirstDay(selectedMonth),
              }).map((_, index) => (
                <div key={`empty-${index}`} />
              ))}

              {/* 날짜 */}
              {Array.from(
                {
                  length:
                    getDaysInMonth(selectedMonth),
                },
                (_, index) => index + 1
              ).map((date) => {
                const selected =
                  selectedDates.includes(date);

                return (
                  <button
                    key={date}
                    type="button"
                    onClick={() =>
                      handleDateClick(date)
                    }
                    className={`
                      aspect-square
                      rounded-xl
                      text-xs font-semibold
                      transition
                      ${
                        selected
                          ? 'bg-[#27D55B] text-white'
                          : 'text-gray-700 hover:bg-green-50'
                      }
                    `}
                  >
                    {date}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="my-6 border-t border-gray-100" />

          {/* 시간 선택 */}
          <div>
            <h3 className="mb-2 text-sm font-bold text-gray-800">
              시간 선택
            </h3>

            <p className="mb-4 text-[11px] text-gray-400">
              가능한 시간을 모두 선택해주세요.
            </p>

            <div className="grid grid-cols-4 gap-2">
              {times.map((time) => {
                const selected =
                  selectedTimes.includes(time);

                return (
                  <button
                    key={time}
                    type="button"
                    onClick={() =>
                      handleTimeClick(time)
                    }
                    className={`
                      rounded-xl border
                      py-2.5
                      text-xs font-semibold
                      transition
                      ${
                        selected
                          ? 'border-[#27D55B] bg-[#27D55B] text-white'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-green-300'
                      }
                    `}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* 선택 현황 */}
        <p className="mt-4 text-center text-xs text-gray-400">
          날짜 {selectedDates.length}개 · 시간{' '}
          {selectedTimes.length}개 선택
        </p>

        {/* 등록 버튼 */}
        <button
          type="button"
          onClick={handleSubmit}
          className="
            mt-5 w-full
            rounded-2xl
            bg-[#27D55B]
            py-4
            text-sm font-bold text-white
            transition
            hover:opacity-90
            active:scale-[0.99]
          "
        >
          내 일정 등록
        </button>
      </div>
    </div>
  );
};

export default ScheduleCoordinationPage;