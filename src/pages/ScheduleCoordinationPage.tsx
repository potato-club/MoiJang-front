import React, {
  useEffect,
  useRef,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

type PickerType =
  | 'startDate'
  | 'startTime'
  | 'endDate'
  | 'endTime'
  | null;

type RepeatType =
  | 'weekly'
  | 'monthly'
  | 'yearly';

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

const ITEM_HEIGHT = 40;
const PICKER_PADDING = 80;

const periods: ('오전' | '오후')[] = [
  '오전',
  '오후',
];

const hours = Array.from(
  { length: 12 },
  (_, index) => index + 1
);

const minutes = [
  0,
  5,
  10,
  15,
  20,
  25,
  30,
  35,
  40,
  45,
  50,
  55,
];

const ScheduleCoordinationPage = () => {
  const navigate = useNavigate();

  // =========================
  // 기본 정보
  // =========================

  const [title, setTitle] = useState('');

  const [startDate, setStartDate] =
    useState<DateValue>({
      year: 2026,
      month: 8,
      day: 14,
    });

  const [endDate, setEndDate] =
    useState<DateValue>({
      year: 2026,
      month: 8,
      day: 14,
    });

  const [startTime, setStartTime] =
    useState<TimeValue>({
      period: '오후',
      hour: 5,
      minute: 0,
    });

  const [endTime, setEndTime] =
    useState<TimeValue>({
      period: '오후',
      hour: 5,
      minute: 0,
    });

  const [repeat, setRepeat] =
    useState<RepeatType>('weekly');

  const [picker, setPicker] =
    useState<PickerType>(null);

  // =========================
  // 색상
  // =========================

  const colors = [
    '#FF5A4F',
    '#FFB800',
    '#10CBB5',
    '#C84BDD',
  ];

  const [selectedColor, setSelectedColor] =
    useState('#10CBB5');

  const [
    showColorPicker,
    setShowColorPicker,
  ] = useState(false);

  // =========================
  // 시간 스크롤 ref
  // =========================

  const periodRef =
    useRef<HTMLDivElement>(null);

  const hourRef =
    useRef<HTMLDivElement>(null);

  const minuteRef =
    useRef<HTMLDivElement>(null);

  // =========================
  // 날짜 / 시간 표시
  // =========================

  const formatDate = (date: DateValue) => {
    return `${date.year}. ${date.month}. ${date.day}`;
  };

  const formatTime = (time: TimeValue) => {
    return `${time.period} ${time.hour}:${String(
      time.minute
    ).padStart(2, '0')}`;
  };

  // =========================
  // 달력 관련
  // =========================

  const getDaysInMonth = (
    year: number,
    month: number
  ) => {
    return new Date(
      year,
      month,
      0
    ).getDate();
  };

  const getFirstDay = (
    year: number,
    month: number
  ) => {
    return new Date(
      year,
      month - 1,
      1
    ).getDay();
  };

  // =========================
  // 시간 선택창을 열었을 때
  // 현재 선택된 위치로 자동 이동
  // =========================

  useEffect(() => {
    if (
      picker !== 'startTime' &&
      picker !== 'endTime'
    ) {
      return;
    }

    const currentTime =
      picker === 'startTime'
        ? startTime
        : endTime;

    const periodIndex =
      periods.indexOf(currentTime.period);

    const hourIndex =
      hours.indexOf(currentTime.hour);

    const minuteIndex =
      minutes.indexOf(currentTime.minute);

    // DOM이 열린 뒤 스크롤 위치 설정
    requestAnimationFrame(() => {
      if (periodRef.current) {
        periodRef.current.scrollTop =
          periodIndex * ITEM_HEIGHT;
      }

      if (hourRef.current) {
        hourRef.current.scrollTop =
          hourIndex * ITEM_HEIGHT;
      }

      if (minuteRef.current) {
        minuteRef.current.scrollTop =
          minuteIndex * ITEM_HEIGHT;
      }
    });
  }, [picker]);

  // =========================
  // 달력
  // =========================

  const renderCalendar = (
    type: 'start' | 'end'
  ) => {
    const date =
      type === 'start'
        ? startDate
        : endDate;

    const setDate =
      type === 'start'
        ? setStartDate
        : setEndDate;

    const daysInMonth =
      getDaysInMonth(
        date.year,
        date.month
      );

    const firstDay =
      getFirstDay(
        date.year,
        date.month
      );

    const moveMonth = (
      amount: number
    ) => {
      let newYear = date.year;
      let newMonth =
        date.month + amount;

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
      <div className="mt-4">

        {/* 달력 월 */}
        <div className="mb-4 flex items-center justify-between px-2">

          <button
            type="button"
            onClick={() =>
              moveMonth(-1)
            }
            className="p-1 text-gray-400"
          >
            ‹
          </button>

          <p className="text-xs font-semibold text-gray-700">
            {date.year}년 {date.month}월
          </p>

          <button
            type="button"
            onClick={() =>
              moveMonth(1)
            }
            className="p-1 text-gray-400"
          >
            ›
          </button>

        </div>

        {/* 요일 */}
        <div className="mb-3 grid grid-cols-7 text-center">

          {[
            '일',
            '월',
            '화',
            '수',
            '목',
            '금',
            '토',
          ].map((day, index) => (
            <div
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
            </div>
          ))}

        </div>

        {/* 날짜 */}
        <div className="grid grid-cols-7 gap-y-3 text-center">

          {Array.from({
            length: firstDay,
          }).map((_, index) => (
            <div
              key={`empty-${index}`}
            />
          ))}

          {Array.from(
            {
              length: daysInMonth,
            },
            (_, index) => index + 1
          ).map((day) => {
            const selected =
              date.day === day;

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
                  mx-auto
                  flex h-8 w-8
                  items-center
                  justify-center
                  rounded-full
                  text-xs
                  transition
                  ${
                    selected
                      ? 'bg-[#252525] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
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

  // =========================
  // 시간 자동 선택
  // =========================

  const handleTimeScroll = (
    element: HTMLDivElement,
    values:
      | string[]
      | number[],
    valueType:
      | 'period'
      | 'hour'
      | 'minute',
    type: 'start' | 'end'
  ) => {
    const index = Math.round(
      element.scrollTop /
        ITEM_HEIGHT
    );

    const safeIndex = Math.max(
      0,
      Math.min(
        index,
        values.length - 1
      )
    );

    const selectedValue =
      values[safeIndex];

    if (type === 'start') {
      setStartTime((prev) => {
        if (
          valueType === 'period'
        ) {
          return {
            ...prev,
            period:
              selectedValue as
                | '오전'
                | '오후',
          };
        }

        if (
          valueType === 'hour'
        ) {
          return {
            ...prev,
            hour:
              selectedValue as number,
          };
        }

        return {
          ...prev,
          minute:
            selectedValue as number,
        };
      });
    } else {
      setEndTime((prev) => {
        if (
          valueType === 'period'
        ) {
          return {
            ...prev,
            period:
              selectedValue as
                | '오전'
                | '오후',
          };
        }

        if (
          valueType === 'hour'
        ) {
          return {
            ...prev,
            hour:
              selectedValue as number,
          };
        }

        return {
          ...prev,
          minute:
            selectedValue as number,
        };
      });
    }
  };

  // =========================
  // 시간 휠
  // =========================

  const renderTimePicker = (
    type: 'start' | 'end'
  ) => {
    const time =
      type === 'start'
        ? startTime
        : endTime;

    return (
      <div
        className="
          relative mt-2
          h-[200px]
          overflow-hidden
        "
      >

        {/* 가운데 회색 선택 영역 */}
        <div
          className="
            pointer-events-none
            absolute
            left-0 right-0
            top-1/2
            z-0
            h-10
            -translate-y-1/2
            rounded-lg
            bg-[#F3F3F3]
          "
        />

        <div className="relative z-10 grid h-full grid-cols-3">

          {/* 오전 / 오후 */}
          <div
            ref={periodRef}
            onScroll={(e) =>
              handleTimeScroll(
                e.currentTarget,
                periods,
                'period',
                type
              )
            }
            className="
              h-full
              snap-y
              snap-mandatory
              overflow-y-auto
              py-[80px]
              text-center
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
            "
          >
            {periods.map(
              (period) => (
                <div
                  key={period}
                  className={`
                    flex h-10
                    snap-center
                    items-center
                    justify-center
                    text-sm
                    transition
                    ${
                      time.period ===
                      period
                        ? 'font-medium text-gray-900'
                        : 'text-gray-300'
                    }
                  `}
                >
                  {period}
                </div>
              )
            )}
          </div>

          {/* 시 */}
          <div
            ref={hourRef}
            onScroll={(e) =>
              handleTimeScroll(
                e.currentTarget,
                hours,
                'hour',
                type
              )
            }
            className="
              h-full
              snap-y
              snap-mandatory
              overflow-y-auto
              py-[80px]
              text-center
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
            "
          >
            {hours.map((hour) => (
              <div
                key={hour}
                className={`
                  flex h-10
                  snap-center
                  items-center
                  justify-center
                  text-sm
                  transition
                  ${
                    time.hour === hour
                      ? 'font-medium text-gray-900'
                      : 'text-gray-300'
                  }
                `}
              >
                {hour}
              </div>
            ))}
          </div>

          {/* 분 */}
          <div
            ref={minuteRef}
            onScroll={(e) =>
              handleTimeScroll(
                e.currentTarget,
                minutes,
                'minute',
                type
              )
            }
            className="
              h-full
              snap-y
              snap-mandatory
              overflow-y-auto
              py-[80px]
              text-center
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
            "
          >
            {minutes.map(
              (minute) => (
                <div
                  key={minute}
                  className={`
                    flex h-10
                    snap-center
                    items-center
                    justify-center
                    text-sm
                    transition
                    ${
                      time.minute ===
                      minute
                        ? 'font-medium text-gray-900'
                        : 'text-gray-300'
                    }
                  `}
                >
                  {String(
                    minute
                  ).padStart(
                    2,
                    '0'
                  )}
                </div>
              )
            )}
          </div>

        </div>
      </div>
    );
  };

  // =========================
  // 일정 생성
  // =========================

  const handleCreate = () => {
    if (!title.trim()) {
      alert(
        '제목을 입력해주세요.'
      );
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

    // 프론트 테스트용 저장
    localStorage.setItem(
      'roomSchedule',
      JSON.stringify(schedule)
    );

    console.log(
      '생성된 일정:',
      schedule
    );

    alert(
      '일정이 생성되었습니다!'
    );

    navigate(
      '/schedule-overview'
    );
  };

  return (
    <div className="min-h-screen bg-white">

      <div
        className="
          mx-auto
          flex min-h-screen
          w-full max-w-md
          flex-col
          bg-white
          px-5 py-6
        "
      >

        {/* ================= */}
        {/* 헤더 */}
        {/* ================= */}

        <header
          className="
            relative mb-8
            flex items-center
            justify-center
          "
        >
          <button
            type="button"
            onClick={() =>
              navigate(-1)
            }
            className="
              absolute left-0
              flex h-9 w-9
              items-center
              justify-center
              text-gray-700
            "
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
                strokeWidth={1.8}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <h1 className="text-base font-bold text-gray-900">
            일정 추가
          </h1>
        </header>

        {/* ================= */}
        {/* 제목 */}
        {/* ================= */}

        <div className="relative mb-8">

          <input
            type="text"
            value={title}
            onChange={(e) =>
              setTitle(
                e.target.value
              )
            }
            placeholder="제목을 입력해주세요"
            className="
              w-full
              rounded-xl
              border
              border-gray-200
              bg-white
              px-4 py-4
              pr-12
              text-xs
              text-gray-800
              outline-none
              placeholder:text-gray-300
              focus:border-[#27D55B]
            "
          />

          <button
            type="button"
            onClick={() =>
              setShowColorPicker(
                true
              )
            }
            className="
              absolute
              right-4
              top-1/2
              h-5 w-5
              -translate-y-1/2
              rounded-full
            "
            style={{
              backgroundColor:
                selectedColor,
            }}
          />

        </div>

        {/* ================= */}
        {/* 시작 */}
        {/* ================= */}

        <section className="mb-7">

          <p className="mb-3 text-xs font-bold text-gray-800">
            시작
          </p>

          <div className="grid grid-cols-2 gap-3">

            {/* 시작 날짜 */}
            <button
              type="button"
              onClick={() =>
                setPicker(
                  picker ===
                    'startDate'
                    ? null
                    : 'startDate'
                )
              }
              className={`
                rounded-xl
                border
                px-3 py-3.5
                text-xs
                ${
                  picker ===
                  'startDate'
                    ? 'border-[#27D55B] bg-green-50 text-[#27D55B]'
                    : 'border-gray-200 bg-white text-gray-500'
                }
              `}
            >
              {formatDate(
                startDate
              )}
            </button>

            {/* 시작 시간 */}
            <button
              type="button"
              onClick={() =>
                setPicker(
                  picker ===
                    'startTime'
                    ? null
                    : 'startTime'
                )
              }
              className={`
                rounded-xl
                border
                px-3 py-3.5
                text-xs
                ${
                  picker ===
                  'startTime'
                    ? 'border-[#27D55B] bg-green-50 text-[#27D55B]'
                    : 'border-gray-200 bg-white text-gray-500'
                }
              `}
            >
              {formatTime(
                startTime
              )}
            </button>

          </div>

          {picker ===
            'startDate' &&
            renderCalendar(
              'start'
            )}

          {picker ===
            'startTime' &&
            renderTimePicker(
              'start'
            )}

        </section>

        {/* ================= */}
        {/* 종료 */}
        {/* ================= */}

        <section className="mb-7">

          <p className="mb-3 text-xs font-bold text-gray-800">
            종료
          </p>

          <div className="grid grid-cols-2 gap-3">

            {/* 종료 날짜 */}
            <button
              type="button"
              onClick={() =>
                setPicker(
                  picker ===
                    'endDate'
                    ? null
                    : 'endDate'
                )
              }
              className={`
                rounded-xl
                border
                px-3 py-3.5
                text-xs
                ${
                  picker ===
                  'endDate'
                    ? 'border-[#27D55B] bg-green-50 text-[#27D55B]'
                    : 'border-gray-200 bg-white text-gray-500'
                }
              `}
            >
              {formatDate(
                endDate
              )}
            </button>

            {/* 종료 시간 */}
            <button
              type="button"
              onClick={() =>
                setPicker(
                  picker ===
                    'endTime'
                    ? null
                    : 'endTime'
                )
              }
              className={`
                rounded-xl
                border
                px-3 py-3.5
                text-xs
                ${
                  picker ===
                  'endTime'
                    ? 'border-[#27D55B] bg-green-50 text-[#27D55B]'
                    : 'border-gray-200 bg-white text-gray-500'
                }
              `}
            >
              {formatTime(
                endTime
              )}
            </button>

          </div>

          {picker ===
            'endDate' &&
            renderCalendar(
              'end'
            )}

          {picker ===
            'endTime' &&
            renderTimePicker(
              'end'
            )}

        </section>

        {/* ================= */}
        {/* 반복 */}
        {/* ================= */}

        <section className="mb-7">

          <p className="mb-3 text-xs font-bold text-gray-800">
            반복
          </p>

          <div className="grid grid-cols-3 gap-3">

            <button
              type="button"
              onClick={() =>
                setRepeat(
                  'weekly'
                )
              }
              className={`
                rounded-xl
                border
                py-3
                text-xs
                ${
                  repeat ===
                  'weekly'
                    ? 'border-[#27D55B] bg-green-50 text-[#27D55B]'
                    : 'border-gray-200 bg-white text-gray-500'
                }
              `}
            >
              매주
            </button>

            <button
              type="button"
              onClick={() =>
                setRepeat(
                  'monthly'
                )
              }
              className={`
                rounded-xl
                border
                py-3
                text-xs
                ${
                  repeat ===
                  'monthly'
                    ? 'border-[#27D55B] bg-green-50 text-[#27D55B]'
                    : 'border-gray-200 bg-white text-gray-500'
                }
              `}
            >
              매월
            </button>

            <button
              type="button"
              onClick={() =>
                setRepeat(
                  'yearly'
                )
              }
              className={`
                rounded-xl
                border
                py-3
                text-xs
                ${
                  repeat ===
                  'yearly'
                    ? 'border-[#27D55B] bg-green-50 text-[#27D55B]'
                    : 'border-gray-200 bg-white text-gray-500'
                }
              `}
            >
              매년
            </button>

          </div>

        </section>

        {/* ================= */}
        {/* 생성하기 */}
        {/* ================= */}

        <div className="mt-auto pt-8">

          <button
            type="button"
            onClick={
              handleCreate
            }
            className="
              w-full
              rounded-xl
              bg-[#27D55B]
              py-4
              text-sm
              font-bold
              text-white
              transition
              hover:opacity-90
              active:scale-[0.99]
            "
          >
            생성하기
          </button>

        </div>

      </div>

      {/* ================= */}
      {/* 색상 선택 */}
      {/* ================= */}

      {showColorPicker && (
        <div
          className="
            fixed inset-0
            z-50
            flex items-end
            justify-center
            bg-black/30
          "
        >
          <div
            className="
              w-full
              max-w-md
              rounded-t-[28px]
              bg-white
              px-6
              pb-8
              pt-6
            "
          >

            {/* 손잡이 */}
            <div className="mb-6 flex justify-center">
              <div className="h-1 w-10 rounded-full bg-gray-200" />
            </div>

            <p className="mb-7 text-center text-sm font-bold text-gray-900">
              색상 선택
            </p>

            <div className="mb-8 flex justify-center gap-7">

              {colors.map(
                (color) => {
                  const selected =
                    selectedColor ===
                    color;

                  return (
                    <button
                      key={
                        color
                      }
                      type="button"
                      onClick={() =>
                        setSelectedColor(
                          color
                        )
                      }
                      className="
                        flex
                        h-12 w-12
                        items-center
                        justify-center
                        rounded-full
                      "
                      style={{
                        backgroundColor:
                          color,
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
                            strokeWidth={
                              3
                            }
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </button>
                  );
                }
              )}

            </div>

            <button
              type="button"
              onClick={() =>
                setShowColorPicker(
                  false
                )
              }
              className="
                w-full
                rounded-xl
                bg-[#27D55B]
                py-4
                text-sm
                font-bold
                text-white
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

export default ScheduleCoordinationPage;