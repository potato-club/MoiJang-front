import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 알림 데이터 인터페이스
interface NotificationData {
  id: number;
  type: 'accept' | 'check'; // accept: 수락 전, check: 수락 완료
  senderName: string;       // 보낸 사람/대상 이름 (예: 길동, 감자)
  category: 'friend' | 'room'; // 친구 요청 vs 방 초대 요청 구분
  createdAt: string;
}

const NotificationPage = () => {
  const navigate = useNavigate();

  // 대기 중인 요청 데이터
  const [pendingNotifications, setPendingNotifications] = useState<NotificationData[]>([
    { id: 1, type: 'accept', senderName: '길동', category: 'friend', createdAt: '2026.08.11' },
    { id: 2, type: 'accept', senderName: '감자', category: 'room', createdAt: '2026.08.11' },
  ]);

  // 최근 7일 알림 데이터
  const [recentNotifications, setRecentNotifications] = useState<NotificationData[]>([
    { id: 3, type: 'check', senderName: '고구마', category: 'room', createdAt: '2026.08.08' },
    { id: 4, type: 'accept', senderName: '고구마', category: 'friend', createdAt: '2026.08.06' },
  ]);

  // [수락 처리 핸들러]
  const handleAccept = (id: number, isPending: boolean) => {
    const updateList = (prev: NotificationData[]) =>
      prev.map((item) => (item.id === id ? { ...item, type: 'check' as const } : item));

    if (isPending) {
      setPendingNotifications(updateList);
    } else {
      setRecentNotifications(updateList);
    }
  };

  // [삭제 처리 핸들러]
  const handleDelete = (id: number, isPending: boolean) => {
    if (isPending) {
      setPendingNotifications((prev) => prev.filter((item) => item.id !== id));
    } else {
      setRecentNotifications((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const isEmpty = pendingNotifications.length === 0 && recentNotifications.length === 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* 상단 헤더 */}
      <header className="max-w-md mx-auto flex items-center mb-6 gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-gray-700 hover:text-black transition p-1"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-gray-800">알림</h1>
      </header>

      <main className="max-w-md mx-auto space-y-6">
        {isEmpty ? (
          <div className="text-center py-20 text-gray-400 font-medium">
            새로운 알림이 없습니다.
          </div>
        ) : (
          <>
            {/* 대기 중인 요청 */}
            {pendingNotifications.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-gray-500 mb-3 ml-1">대기 중인 요청</h2>
                <div className="space-y-3">
                  {pendingNotifications.map((item) => (
                    <NotificationItem
                      key={item.id}
                      item={item}
                      onAccept={() => handleAccept(item.id, true)}
                      onDelete={() => handleDelete(item.id, true)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* 최근 7일 */}
            {recentNotifications.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-gray-500 mb-3 ml-1">최근 7일</h2>
                <div className="space-y-3">
                  {recentNotifications.map((item) => (
                    <NotificationItem
                      key={item.id}
                      item={item}
                      onAccept={() => handleAccept(item.id, false)}
                      onDelete={() => handleDelete(item.id, false)}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
};

// 알림 항목 컴포넌트
interface NotificationItemProps {
  item: NotificationData;
  onAccept: () => void;
  onDelete: () => void;
}

const NotificationItem = ({ item, onAccept, onDelete }: NotificationItemProps) => {
  const { type, senderName, category, createdAt } = item;

  // 알림 상태 및 카테고리에 따른 문구 자동 생성 함수
  const renderText = () => {
    if (type === 'check') {
      return `${senderName} 요청 수락 완료`;
    }

    if (category === 'friend') {
      return `${senderName} 님이 친구 추가를 보냈습니다`;
    } else {
      return `${senderName} 방에 초대 요청이 왔습니다`;
    }
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between border border-gray-100 transition hover:shadow-md">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
          👤
        </div>
        <div className="flex flex-col">
          {/* 수락 상태에 따라 동적으로 문구가 변경되는 부분 */}
          <span className="text-sm font-medium text-gray-800">{renderText()}</span>
          <span className="text-[11px] text-gray-400 mt-0.5">{createdAt}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {type === 'accept' ? (
          /* 수락 버튼 */
          <button
            type="button"
            onClick={onAccept}
            style={{ backgroundColor: '#27D55B' }}
            className="px-3 py-1.5 text-xs text-white rounded-xl font-bold transition shadow-sm active:scale-95 hover:opacity-90"
          >
            수락
          </button>
        ) : (
          /* 수락 완료 시 연한 녹색 체크 버튼으로 전환 */
          <button
            type="button"
            disabled
            style={{ color: '#27D55B' }}
            className="w-7 h-7 bg-green-50 rounded-lg flex items-center justify-center text-xs font-bold transition cursor-default"
          >
            ✓
          </button>
        )}

        <button
          type="button"
          onClick={onDelete}
          className="text-gray-300 hover:text-gray-500 font-bold p-1 transition text-sm active:scale-90"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default NotificationPage;