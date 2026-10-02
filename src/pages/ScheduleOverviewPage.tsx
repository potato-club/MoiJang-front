import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SavedSchedule {
  year: number;
  month: number;
  dates: number[];
  times: string[];
}

const ScheduleOverviewPage = () => {
  const navigate = useNavigate();

  /*
    현재는 localStorage에서 "내 일정"만 가져옴.

    나중에 백엔드 연결 후에는
    방 참여자 전체의 일정 데이터를 받아와서
    같은 날짜/시간별 count를 계산하면 됨.
  */
  const [schedule] = useState<SavedSchedule | null>(() => {
    const saved = localStorage.getItem(
      'myScheduleAvailability'
    );

    if (!saved) {
      return null;
    }

    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  });

  const times = [
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
  '19:00',
  '20:00',
  '21:00',
  '22:00',
];

  const getDayName = (date: number) => {
    if (!schedule) {
      return '';
    }

    const dayNames = [
      '일',
      '월',
      '화',
      '수',
      '목',
      '금',
      '토',
    ];

    const targetDate = new Date(
      schedule.year,
      schedule.month - 1,
      date
    );

    return dayNames[targetDate.getDay()];
  };

  /*
    현재는 나 한 명의 데이터만 있으므로
    선택한 시간 = 1명
    선택하지 않은 시간 = 0명

    나중에는 백엔드 데이터를 이용해서
    여기에서 2명, 3명, 4명... 계산
  */
  const getCount = (
    date: number,
    time: string
  ) => {
    if (!schedule) {
      return 0;
    }

    const dateSelected =
      schedule.dates.includes(date);

    const timeSelected =
      schedule.times.includes(time);

    if (dateSelected && timeSelected) {
      return 1;
    }

    return 0;
  };

  /*
    인원수가 많을수록 진한 초록색
  */
  const getColor = (count: number) => {
    if (count >= 4) {
      return 'bg-[#22C55E] text-white';
    }

    if (count === 3) {
      return 'bg-green-300 text-green-900';
    }

    if (count === 2) {
      return 'bg-green-200 text-green-800';
    }

    if (count === 1) {
      return 'bg-green-100 text-green-700';
    }

    return 'bg-white';
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto w-full max-w-md">

        {/* 헤더 */}
        <header className="relative mb-8 flex items-center justify-center">
          <button
            type="button"
            onClick={() => navigate('/main')}
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
            일정 조율
          </h1>
        </header>

        {/* 제목 */}
        <section className="mb-6">
          <p className="mb-1 text-xs text-gray-400">
            동아리 정기 모임
          </p>

          <h2 className="text-xl font-bold text-gray-900">
            가능한 시간을 확인해보세요
          </h2>

          <p className="mt-2 text-xs leading-5 text-gray-400">
            색이 진할수록 더 많은 인원이 가능한 시간입니다.
          </p>
        </section>

        {/* ================================================= */}
        {/* 아무도 등록하지 않았을 때 */}
        {/* ================================================= */}

        {!schedule && (
          <>
            <section className="flex min-h-[330px] flex-col items-center justify-center rounded-3xl border border-gray-100 bg-white px-6 text-center shadow-sm">

              {/* 아이콘 */}
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
                <svg
                  className="h-8 w-8 text-[#27D55B]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M8 7V3m8 4V3M5 11h14M5 5h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z"
                  />
                </svg>
              </div>

              <h3 className="text-base font-bold text-gray-800">
                아직 등록된 일정이 없어요
              </h3>

              <p className="mt-2 text-xs leading-5 text-gray-400">
                가능한 날짜와 시간을 등록하면
                <br />
                이곳에서 함께 확인할 수 있어요.
              </p>
            </section>

            {/* 일정 추가 */}
            <button
              type="button"
              onClick={() =>
                navigate('/schedule-coordination')
              }
              className="
                mt-6 w-full
                rounded-2xl
                bg-[#27D55B]
                py-4
                text-sm font-bold text-white
              "
            >
              + 내 일정 추가
            </button>
          </>
        )}

        {/* ================================================= */}
        {/* 한 명 이상 등록했을 때 */}
        {/* ================================================= */}

        {schedule && (
          <>
            {/* 합산 시간표 */}
            <section className="overflow-x-auto rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">

              <div
                className="grid"
                style={{
                  gridTemplateColumns: `55px repeat(${schedule.dates.length}, minmax(70px, 1fr))`,
                  minWidth:
                    schedule.dates.length > 5
                      ? `${
                          55 +
                          schedule.dates.length * 70
                        }px`
                      : undefined,
                }}
              >

                {/* 왼쪽 위 */}
                <div />

                {/* 날짜 */}
                {schedule.dates.map((date) => (
                  <div
                    key={`date-${date}`}
                    className="pb-3 text-center"
                  >
                    <p className="text-[10px] text-gray-400">
                      {getDayName(date)}
                    </p>

                    <p className="text-xs font-bold text-gray-800">
                      {schedule.month}/{date}
                    </p>
                  </div>
                ))}

                {/* 시간 */}
                {times.map((time) => [
                  <div
                    key={`label-${time}`}
                    className="
                      flex h-10
                      justify-end
                      pr-2 pt-1
                      text-[10px]
                      text-gray-400
                    "
                  >
                    {time}
                  </div>,

                  ...schedule.dates.map((date) => {
                    const count =
                      getCount(date, time);

                    return (
                      <div
                        key={`${date}-${time}`}
                        className={`
                          h-10
                          border-b
                          border-l
                          border-gray-100
                          flex
                          items-center
                          justify-center
                          transition
                          ${getColor(count)}
                        `}
                      >
                        {count > 0 && (
                          <span className="text-[9px] font-bold">
                            {count}명
                          </span>
                        )}
                      </div>
                    );
                  }),
                ])}
              </div>
            </section>

            {/* 범례 */}
            <section className="mt-5 flex items-center justify-center gap-4 text-[10px] text-gray-500">

              <div className="flex items-center gap-1">
                <span className="h-3 w-3 rounded bg-green-100" />
                1명
              </div>

              <div className="flex items-center gap-1">
                <span className="h-3 w-3 rounded bg-green-200" />
                2명
              </div>

              <div className="flex items-center gap-1">
                <span className="h-3 w-3 rounded bg-green-300" />
                3명
              </div>

              <div className="flex items-center gap-1">
                <span className="h-3 w-3 rounded bg-[#22C55E]" />
                4명+
              </div>

            </section>

            {/* 참여 현황 */}
            <section className="mt-6 rounded-2xl border border-gray-100 bg-white p-4">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-xs text-gray-400">
                    일정 참여 현황
                  </p>

                  <p className="mt-1 text-sm font-bold text-gray-800">
                    1명이 일정을 입력했어요
                  </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-50">
                  <span className="text-sm font-bold text-[#27D55B]">
                    1
                  </span>
                </div>

              </div>
            </section>

            {/* 내 일정 수정 */}
            <button
              type="button"
              onClick={() =>
                navigate('/schedule-coordination')
              }
              className="
                mt-6 w-full
                rounded-2xl
                bg-[#27D55B]
                py-4
                text-sm font-bold
                text-white
                transition
                hover:opacity-90
              "
            >
              내 가능 시간 수정하기
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ScheduleOverviewPage;