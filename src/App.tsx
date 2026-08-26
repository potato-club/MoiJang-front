import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import MyPage from './pages/MyPage';
import NotificationPage from './pages/NotificationPage'; 
import RoomCreatePage from './pages/RoomCreatePage';
import RoomJoinPage from './pages/RoomJoinPage';
import FriendsPage from './pages/FriendsPage';
import ScheduleCreatePage from './pages/ScheduleCreatePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 기본 주소(/) 접속 시 로그인 페이지 */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/room-create" element={<RoomCreatePage />} />
        <Route path="/room-join/:roomId" element={<RoomJoinPage />} />
        <Route path="/friends" element={<FriendsPage />} />
        <Route path="/schedule-create" element={<ScheduleCreatePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;