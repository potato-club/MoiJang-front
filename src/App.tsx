import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import MyPage from './pages/MyPage';
import NotificationPage from './pages/NotificationPage';
import RoomCreatePage from './pages/RoomCreatePage';
import RoomJoinPage from './pages/RoomJoinPage';
import ScheduleCoordinationPage from './pages/ScheduleCoordinationPage';
import ScheduleOverviewPage from './pages/ScheduleOverviewPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/room-create" element={<RoomCreatePage />} />
        <Route path="/room-join/:roomId" element={<RoomJoinPage />} />

        <Route
          path="/schedule-overview"
          element={<ScheduleOverviewPage />}
        />

        <Route
          path="/schedule-coordination"
          element={<ScheduleCoordinationPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;