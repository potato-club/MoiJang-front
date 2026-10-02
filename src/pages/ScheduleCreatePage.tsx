import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type RepeatType = 'weekly' | 'monthly' | 'yearly' | null;
type PickerType =
  | 'startDate'
  | 'startTime'
  | 'endDate'
  | 'endTime'
  | null;

interface DateValue {
  year: number;
  month: number;
  day: number;
}

interface TimeValue {
  period: '오전' | '오후';
  hour: number;
  minute: number;
}

const ScheduleCreatePage = () => {
  const navigate = useNavigate();

  // 제목
  const [title, setTitle] = useState('');

  // 시작 날짜
  const [startDate, setStartDate] = useState<DateValue>({
    year: 2026,
    month: 8,
    day: 14,
  });

  // 종료 날짜
  const [endDate, setEndDate] = useState<DateValue>({
    year: 2026,
    month: 8,
    day: 14,
  });

  // 시작 시간
  const [startTime, setStartTime] = useState<TimeValue>({
    period: '오후',
    hour: 5,
    minute: 0,
  });

  // 종료 시간
  const [endTime, setEndTime] = useState<TimeValue>({
    period: '오후',
    hour: 5,
    minute: 0,
  });

  // 반복
  const [repeat, setRepeat] = useState<RepeatType>(null);

  // 현재 열려 있는 선택창
  const [picker, setPicker] = useState<PickerType>(null);

  // 카테고리 색상 선택창
  const [showColorPicker, setShowColorPicker] =
    useState(false);

  const colors = [
    '#FF5A4F',
    '#FFB800',
    '#18C7B5',
    '#C94ADB',
  ];

  const [selectedColor, setSelectedColor] =
    useState('#18C7B5');

  // 날짜 출력
  const formatDate = (date: DateValue) => {
    return `${date.year}. ${date.month}. ${date.day}`;
  };

  // 시간 출력
  const formatTime = (time: TimeValue) => {
    return `${time.period} ${time.hour}:${String(
      time.minute
    ).padStart(2, '0')}`;
  };

  // 해당 월의 날짜 수
  const getDaysInMonth = (
    year: number,
    month: number
  ) => {
    return new Date(year, month, 0).getDate();
  };

  // 해당 월 1일의 요일
  const getFirstDay = (
    year: number,
    month: number
  ) => {
    return new Date(year, month - 1, 1).getDay();
  };

  // 날짜 선택 달력
  const renderCalendar = (
    type: 'start' | 'end'
  ) => {
    const date =
      type === 'start' ? startDate : endDate;

    const setDate =
      type === 'start'
        ? setStartDate
        : setEndDate;

    const daysInMonth = getDaysInMonth(
      date.year,
      date.month
    );

    const firstDay = getFirstDay(
      date.year,
      date.month
    );

    const moveMonth = (amount: number) => {
      let newYear = date.year;
      let newMonth = date.month + amount;

      if (newMonth < 1) {
        newMonth = 12;
        newYear -= 1;
      }

      if (newMonth > 12) {
        newMonth = 1;
        newYear += 1;
      }

      setDate({
        year: newYear,
        month: newMonth,
        day: 1,
      });
    };

    return (
      <div className="mt-3 rounded-2xl bg-white px-3 py-4">

        {/* 달력 상단 */}
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => moveMonth(-1)}
            className="p-2 text-gray-400"
          >
            ‹
          </button>

          <p className="text-sm font-semibold text-gray-700">
            {date.year}년 {date.month}월
          </p>

          <button
            type="button"
            onClick={() => moveMonth(1)}
            className="p-2 text-gray-400"
          >
            ›
          </button>
        </div>

        {/* 요일 */}
        <div className="mb-2 grid grid-cols-7 text-center">
          {['일', '월', '화', '수', '목', '금', '토'].map(
            (day, index) => (
              <span
                key={day}
                className={`text-[10px] ${
                  index === 0
                    ? 'text-red-400'
                    : index === 6
                    ? 'text-blue-400'
                    : 'text-gray-400'
                }`}
              >
                {day}
              </span>
            )
          )}
        </div>

        {/* 날짜 */}
        <div className="grid grid-cols-7 gap-y-2">
          {Array.from({
            length: firstDay,
          }).map((_, index) => (
            <div key={`empty-${index}`} />
          ))}

          {Array.from(
            { length: daysInMonth },
            (_, index) => index + 1
          ).map((day) => {
            const selected = date.day === day;

            return (
              <button
                key={day}
                type="button"
                onClick={() => {
                  setDate({
                    ...date,
                    day,
                  });

                  setPicker(null);
                }}
                className={`
                  mx-auto flex h-8 w-8
                  items-center justify-center
                  rounded-full
                  text-xs
                  transition
                  ${
                    selected
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }
                `}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // 시간 선택
  const renderTimePicker = (
    type: 'start' | 'end'
  ) => {
    const time =
      type === 'start' ? startTime : endTime;

    const setTime =
      type === 'start'
        ? setStartTime
        : setEndTime;

    const minutes = [
      0, 5, 10, 15, 20, 25,
      30, 35, 40, 45, 50, 55,
    ];

    return (
      <div className="mt-3 rounded-2xl bg-white p-4">

        <div className="grid grid-cols-3 gap-3">

          {/* 오전 / 오후 */}
          <div className="max-h-36 overflow-y-auto">
            {(['오전', '오후'] as const).map(
              (period) => (
                <button
                  key={period}
                  type="button"
                  onClick={() =>
                    setTime({
                      ...time,
                      period,
                    })
                  }
                  className={`
                    mb-1 w-full rounded-lg py-2
                    text-xs
                    ${
                      time.period === period
                        ? 'bg-gray-100 font-bold text-gray-900'
                        : 'text-gray-400'
                    }
                  `}
                >
                  {period}
                </button>
              )
            )}
          </div>

          {/* 시 */}
          <div className="max-h-36 overflow-y-auto">
            {Array.from(
              { length: 12 },
              (_, index) => index + 1
            ).map((hour) => (
              <button
                key={hour}
                type="button"
                onClick={() =>
                  setTime({
                    ...time,
                    hour,
                  })
                }
                className={`
                  mb-1 w-full rounded-lg py-2
                  text-xs
                  ${
                    time.hour === hour
                      ? 'bg-gray-100 font-bold text-gray-900'
                      : 'text-gray-400'
                  }
                `}
              >
                {hour}
              </button>
            ))}
          </div>

          {/* 분 */}
          <div className="max-h-36 overflow-y-auto">
            {minutes.map((minute) => (
              <button
                key={minute}
                type="button"
                onClick={() =>
                  setTime({
                    ...time,
                    minute,
                  })
                }
                className={`
                  mb-1 w-full rounded-lg py-2
                  text-xs
                  ${
                    time.minute === minute
                      ? 'bg-gray-100 font-bold text-gray-900'
                      : 'text-gray-400'
                  }
                `}
              >
                {String(minute).padStart(2, '0')}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setPicker(null)}
          className="
            mt-4 w-full rounded-xl
            bg-[#27D55B]
            py-2.5
            text-xs font-bold text-white
          "
        >
          확인
        </button>
      </div>
    );
  };

  // 일정 생성
  const handleCreate = () => {
    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    const schedule = {
      title: title.trim(),
      color: selectedColor,
      startDate,
      startTime,
      endDate,
      endTime,
      repeat,
    };

    // 현재는 프론트 테스트용
    localStorage.setItem(
      'roomSchedule',
      JSON.stringify(schedule)
    );

    console.log('생성된 일정:', schedule);

    alert('일정이 생성되었습니다!');

    // 생성 후 일정 조율 현황으로 이동
    navigate('/schedule-overview');
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-[#F8F8F8] px-5 py-6">

        {/* 헤더 */}
        <header className="relative mb-8 flex items-center justify-center">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="absolute left-0 flex h-9 w-9 items-center justify-center text-gray-700"
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

          <h1 className="text-base font-bold text-gray-900">
            일정 추가
          </h1>
        </header>

        {/* 제목 */}
        <section className="mb-8">
          <div className="relative">
            <input
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="제목을 입력해주세요"
              className="
                w-full rounded-xl
                border border-gray-200
                bg-white
                px-4 py-4 pr-12
                text-sm text-gray-800
                outline-none
                placeholder:text-gray-400
                focus:border-[#27D55B]
              "
            />

            <button
              type="button"
              onClick={() =>
                setShowColorPicker(true)
              }
              className="
                absolute right-4 top-1/2
                h-5 w-5
                -translate-y-1/2
                rounded-full
              "
              style={{
                backgroundColor: selectedColor,
              }}
            />
          </div>
        </section>

        {/* 시작 */}
        <section className="mb-7">
          <h2 className="mb-3 text-sm font-bold text-gray-800">
            시작
          </h2>

          <div className="grid grid-cols-2 gap-3">

            {/* 시작 날짜 */}
            <button
              type="button"
              onClick={() =>
                setPicker(
                  picker === 'startDate'
                    ? null
                    : 'startDate'
                )
              }
              className={`
                rounded-xl border
                bg-white
                px-4 py-3.5
                text-left text-xs
                ${
                  picker === 'startDate'
                    ? 'border-[#27D55B] text-[#27D55B]'
                    : 'border-gray-200 text-gray-500'
                }
              `}
            >
              {formatDate(startDate)}
            </button>

            {/* 시작 시간 */}
            <button
              type="button"
              onClick={() =>
                setPicker(
                  picker === 'startTime'
                    ? null
                    : 'startTime'
                )
              }
              className={`
                rounded-xl border
                bg-white
                px-4 py-3.5
                text-left text-xs
                ${
                  picker === 'startTime'
                    ? 'border-[#27D55B] text-[#27D55B]'
                    : 'border-gray-200 text-gray-500'
                }
              `}
            >
              {formatTime(startTime)}
            </button>
          </div>

          {picker === 'startDate' &&
            renderCalendar('start')}

          {picker === 'startTime' &&
            renderTimePicker('start')}
        </section>

        {/* 종료 */}
        <section className="mb-7">
          <h2 className="mb-3 text-sm font-bold text-gray-800">
            종료
          </h2>

          <div className="grid grid-cols-2 gap-3">

            {/* 종료 날짜 */}
            <button
              type="button"
              onClick={() =>
                setPicker(
                  picker === 'endDate'
                    ? null
                    : 'endDate'
                )
              }
              className={`
                rounded-xl border
                bg-white
                px-4 py-3.5
                text-left text-xs
                ${
                  picker === 'endDate'
                    ? 'border-[#27D55B] text-[#27D55B]'
                    : 'border-gray-200 text-gray-500'
                }
              `}
            >
              {formatDate(endDate)}
            </button>

            {/* 종료 시간 */}
            <button
              type="button"
              onClick={() =>
                setPicker(
                  picker === 'endTime'
                    ? null
                    : 'endTime'
                )
              }
              className={`
                rounded-xl border
                bg-white
                px-4 py-3.5
                text-left text-xs
                ${
                  picker === 'endTime'
                    ? 'border-[#27D55B] text-[#27D55B]'
                    : 'border-gray-200 text-gray-500'
                }
              `}
            >
              {formatTime(endTime)}
            </button>
          </div>

          {picker === 'endDate' &&
            renderCalendar('end')}

          {picker === 'endTime' &&
            renderTimePicker('end')}
        </section>

        {/* 반복 */}
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-bold text-gray-800">
            반복
          </h2>

          <div className="grid grid-cols-3 gap-3">

            <button
              type="button"
              onClick={() =>
                setRepeat(
                  repeat === 'weekly'
                    ? null
                    : 'weekly'
                )
              }
              className={`
                rounded-xl border
                bg-white py-3
                text-xs font-semibold
                ${
                  repeat === 'weekly'
                    ? 'border-[#27D55B] text-[#27D55B]'
                    : 'border-gray-200 text-gray-500'
                }
              `}
            >
              매주
            </button>

            <button
              type="button"
              onClick={() =>
                setRepeat(
                  repeat === 'monthly'
                    ? null
                    : 'monthly'
                )
              }
              className={`
                rounded-xl border
                bg-white py-3
                text-xs font-semibold
                ${
                  repeat === 'monthly'
                    ? 'border-[#27D55B] text-[#27D55B]'
                    : 'border-gray-200 text-gray-500'
                }
              `}
            >
              매월
            </button>

            <button
              type="button"
              onClick={() =>
                setRepeat(
                  repeat === 'yearly'
                    ? null
                    : 'yearly'
                )
              }
              className={`
                rounded-xl border
                bg-white py-3
                text-xs font-semibold
                ${
                  repeat === 'yearly'
                    ? 'border-[#27D55B] text-[#27D55B]'
                    : 'border-gray-200 text-gray-500'
                }
              `}
            >
              매년
            </button>
          </div>
        </section>

        {/* 생성하기 */}
        <div className="mt-auto pt-6">
          <button
            type="button"
            onClick={handleCreate}
            className="
              w-full rounded-2xl
              bg-[#27D55B]
              py-4
              text-sm font-bold text-white
              transition
              hover:opacity-90
              active:scale-[0.99]
            "
          >
            생성하기
          </button>
        </div>
      </div>

      {/* ============================== */}
      {/* 카테고리 색상 선택 Bottom Sheet */}
      {/* ============================== */}

      {showColorPicker && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30">

          <div className="w-full max-w-md rounded-t-[28px] bg-white px-6 pb-8 pt-6">

            <div className="mb-7 flex justify-center">
              <div className="h-1 w-10 rounded-full bg-gray-200" />
            </div>

            <h2 className="mb-7 text-center text-sm font-bold text-gray-900">
              색상 선택
            </h2>

            {/* 색상 */}
            <div className="mb-8 flex items-center justify-center gap-7">

              {colors.map((color) => {
                const selected =
                  selectedColor === color;

                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() =>
                      setSelectedColor(color)
                    }
                    className="
                      flex h-12 w-12
                      items-center justify-center
                      rounded-full
                    "
                    style={{
                      backgroundColor: color,
                    }}
                  >
                    {selected && (
                      <svg
                        className="h-5 w-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() =>
                setShowColorPicker(false)
              }
              className="
                w-full rounded-2xl
                bg-[#27D55B]
                py-4
                text-sm font-bold text-white
              "
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleCreatePage;