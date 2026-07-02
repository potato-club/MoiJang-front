// import LoginPage from './pages/LoginPage';
// import './App.css';

// function App() {
//   return (
//     <div className="app-container">
//       <LoginPage />
//     </div>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
// import 경로는 파일 이름과 정확히 일치해야 해!
import NotificationPage from './pages/NotificationPage'; 
import MyPage from './pages/MyPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 기본 주소(/) 접속 시 로그인 페이지 */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/mypage" element={<MyPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;