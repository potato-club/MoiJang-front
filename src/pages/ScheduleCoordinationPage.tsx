import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface TimeBlock {
  day: number;
  start: number;
  duration: number;
  count: number;
}

const ScheduleCoordinationPage = () => {
  const navigate = useNavigate();

  // 임시 데이터 - 나중에 백엔드 API 데이터로 교체
  const days = [
    { date: '8/10', day: '월' },
    { date: '8/11', day: '화' },
    { date: '8/12', day: '수' },
    { date: '8/13', day: '목' },
    { date: '8/14', day: '금' },
  ];

  const hours = [
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
  ];

  // 여러 명이 가능한 시간 예시
  // count가 높을수록 많은 사람이 가능한 시간
  const availableBlocks: TimeBlock[] = [
    { day: 0, start: 1, duration: 2, count: 2 },
    { day: 0, start: 4, duration: 2, count: 3 },
    { day: 0, start: 7, duration: 2, count: 2 },

    { day: 1, start: 0, duration: 2, count: 3 },
    { day: 1, start: 3, duration: 2, count: 2 },

    { day: 2, start: 1, duration: 3, count: 4 },
    { day: 2, start: 5, duration: 2, count: 2 },

    { day: 3, start: 0, duration: 3, count: 3 },
    { day: 3, start: 4, duration: 3, count: 4 },

    { day: 4, start: 2, duration: 2, count: 2 },
    { day: 4, start: 6, duration: 2, count: 3 },
  ];

  const [selectedTime, setSelectedTime] = useState<{
    day: number;
    start: number;
  } | null>(null);

  const [confirmed, setConfirmed] = useState(false);

  const getAvailabilityStyle = (count: number) => {
    if (count >= 4) {
      return 'bg-[#27D55B] text-white';
    }

    if (count === 3) {
      return 'bg-green-300 text-green-900';
    }

    return 'bg-green-100 text-green-700';
  };

  const handleSelectTime = (day: number, start: number) => {
    if (confirmed) return;

    setSelectedTime({
      day,
      start,
    });
  };

  const handleConfirm = () => {
    if (!selectedTime) {
      alert('확정할 시간을 선택해주세요.');
      return;
    }

    if (
      window.confirm(
        `${days[selectedTime.day].date} ${
          days[selectedTime.day].day
        }요일 ${hours[selectedTime.start]}로 확정하시겠습니까?`
      )
    ) {
      // TODO: 추후 백엔드 일정 확정 API 연결
      setConfirmed(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="w-full max-w-md mx-auto">

        {/* 상단 헤더 */}
        <header className="relative flex items-center justify-center mb-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="absolute left-0 p-1 text-gray-700 hover:text-black"
            aria-label="뒤로가기"
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

          <h1 className="text-lg font-bold text-gray-900">
            일정 조율
          </h1>
        </header>

        {/* 방 정보 */}
        <section className="mb-6">
          <p className="text-xs text-gray-400 mb-1">
            동아리 정기 모임
          </p>

          <h2 className="text-xl font-bold text-gray-900">
            가능한 시간을 선택해주세요
          </h2>

          <p className="text-xs text-gray-400 mt-2">
            색이 진할수록 더 많은 인원이 가능한 시간입니다.
          </p>
        </section>

        {/* 시간표 */}
        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-4">

          {/* 날짜 */}
          <div className="grid grid-cols-[45px_repeat(5,1fr)] mb-2">
            <div />

            {days.map((item) => (
              <div
                key={item.date}
                className="text-center"
              >
                <p className="text-[10px] text-gray-400">
                  {item.day}
                </p>

                <p className="text-xs font-bold text-gray-700">
                  {item.date}
                </p>
              </div>
            ))}
          </div>

          {/* 시간표 본체 */}
          <div className="grid grid-cols-[45px_repeat(5,1fr)]">

            {/* 시간 */}
            <div>
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="h-12 text-[10px] text-gray-400 flex items-start justify-end pr-2 pt-1"
                >
                  {hour}
                </div>
              ))}
            </div>

            {/* 날짜별 칸 */}
            {days.map((_, dayIndex) => (
              <div
                key={dayIndex}
                className="relative border-l border-gray-100"
              >
                {hours.map((_, hourIndex) => {
                  const block = availableBlocks.find(
                    (item) =>
                      item.day === dayIndex &&
                      item.start === hourIndex
                  );

                  const isSelected =
                    selectedTime?.day === dayIndex &&
                    selectedTime?.start === hourIndex;

                  return (
                    <div
                      key={hourIndex}
                      className="h-12 border-b border-gray-100 relative"
                    >
                      {block && (
                        <button
                          type="button"
                          onClick={() =>
                            handleSelectTime(
                              dayIndex,
                              hourIndex
                            )
                          }
                          className={`
                            absolute
                            top-0
                            left-0.5
                            right-0.5
                            rounded-md
                            flex
                            items-center
                            justify-center
                            transition
                            ${getAvailabilityStyle(block.count)}
                            ${
                              isSelected
                                ? 'ring-2 ring-black ring-offset-1 z-10'
                                : ''
                            }
                          `}
                          style={{
                            height: `${block.duration * 48}px`,
                          }}
                        >
                          <span className="text-[9px] font-bold">
                            {block.count}명
                          </span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </section>

        {/* 범례 */}
        <section className="flex items-center justify-center gap-4 mt-5 text-[11px] text-gray-500">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-green-100" />
            적음
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-green-300" />
            보통
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-[#27D55B]" />
            많음
          </div>
        </section>

        {/* 선택된 시간 */}
        {selectedTime && (
          <section className="bg-white rounded-2xl border border-gray-100 p-4 mt-5">
            <p className="text-xs text-gray-400 mb-1">
              선택한 시간
            </p>

            <p className="text-sm font-bold text-gray-800">
              {days[selectedTime.day].date}{' '}
              {days[selectedTime.day].day}요일 ·{' '}
              {hours[selectedTime.start]}
            </p>
          </section>
        )}

        {/* 확정 버튼 */}
        <button
          type="button"
          onClick={handleConfirm}
          disabled={confirmed}
          className={`
            w-full mt-6 py-4 rounded-2xl
            text-white font-bold text-sm
            transition active:scale-[0.99]
            ${
              confirmed
                ? 'bg-gray-300 cursor-default'
                : 'bg-[#27D55B] hover:opacity-90'
            }
          `}
        >
          {confirmed ? '확정 완료' : '시간 확정하기'}
        </button>

        {/* 확정 메시지 */}
        {confirmed && selectedTime && (
          <div className="mt-4 bg-green-50 rounded-2xl p-4 text-center">
            <p className="text-sm font-bold text-[#27D55B]">
              일정이 확정되었습니다.
            </p>

            <p className="text-xs text-gray-500 mt-1">
              {days[selectedTime.day].date}{' '}
              {days[selectedTime.day].day}요일{' '}
              {hours[selectedTime.start]}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleCoordinationPage;