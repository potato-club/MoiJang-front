// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// const MainPage = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4">
//       {/* 상단 헤더 */}
//       <header className="max-w-md mx-auto flex justify-between items-center mb-6">
//         <h1 className="text-xl font-bold text-gray-800">내 정보</h1>
//         <div className="flex gap-4">
//           <button className="text-gray-500 text-2xl p-2 hover:bg-gray-100 rounded-full transition">🔄</button>
//           <button className="text-gray-500 text-2xl p-2 hover:bg-gray-100 rounded-full transition" onClick={handleNotification}>
//             🔔
//           </button>
//         </div>
//       </header>
      

//       {/* 메인 달력 카드 */}
//       <main className="max-w-md mx-auto bg-white rounded-3xl shadow-sm p-6">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-lg font-bold">2025년 6월</h2>
//           <div className="flex gap-2">
//             <button>&lt;</button>
//             <button>&gt;</button>
//           </div>
//         </div>

//         {/* 요일 */}
//         <div className="grid grid-cols-7 text-center text-sm text-gray-400 mb-4">
//           {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
//             <div key={day}>{day}</div>
//           ))}
//         </div>

//         {/* 날짜 그리드 */}
//         <div className="grid grid-cols-7 text-center gap-y-4">
//           {[...Array(30)].map((_, i) => {
//             const day = i + 1;
//             // 22일 강조 (예시)
//             const isSelected = day === 22;
//             return (
//               <div
//                 key={day}
//                 className={`w-8 h-8 flex items-center justify-center rounded-full text-sm
//                   ${isSelected ? 'bg-orange-500 text-white font-bold' : 'text-gray-700'}`}
//               >
//                 {day}
//               </div>
//             );
//           })}
//         </div>
//       </main>

//       {/* 방명록 영역 */}
//       <section className="max-w-md mx-auto mt-8">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="font-bold text-gray-800">방 목록</h3>
//           <button className="text-sm bg-gray-200 px-3 py-1 rounded-lg">추가</button>
//         </div>
//         <div className="space-y-3">
//           {[1, 2, 3].map((item) => (
//             <div key={item} className="h-16 bg-white rounded-xl shadow-sm border border-gray-100"></div>
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// };

// export default MainPage;
import React from 'react';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
  // 1. useNavigate 훅 추가 (페이지 이동을 위해 필수!)
  const navigate = useNavigate(); 

  // 2. 버튼 클릭 핸들러 함수 정의
  const handleProfile = () => navigate('/mypage');      // '내 정보' 누르면 마이페이지로
  const handleRefresh = () => window.location.reload(); // '새로고침' 누르면 화면 새로고침
  const handleNotification = () => navigate('/notifications'); // '종 모양' 누르면 알림 페이지로
  const handleAdd = () => alert("방명록 추가 기능 준비 중이야!");
  

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* 상단 헤더 */}
      <header className="max-w-md mx-auto flex justify-between items-center mb-6">
        {/* 내 정보 버튼 */}
        <button 
          onClick={handleProfile}
          className="text-xl font-bold text-gray-800 hover:text-orange-500 transition"
        >
          내 정보
        </button>
        
        <div className="flex gap-4">
          {/* 새로고침 버튼 */}
          <button 
            onClick={handleRefresh}
            className="text-2xl p-2 hover:bg-gray-200 rounded-full transition active:scale-95"
          >
            🔄
          </button>
          {/* 알림 버튼 */}
          <button 
            onClick={handleNotification}
            className="text-2xl p-2 hover:bg-gray-200 rounded-full transition active:scale-95"
          >
            🔔
          </button>
        </div>
      </header>

         {/* 메인 달력 카드 */}
         <main className="max-w-md mx-auto bg-white rounded-3xl shadow-sm p-6">
           <div className="flex justify-between items-center mb-6">
             <h2 className="text-lg font-bold">2025년 6월</h2>
             <div className="flex gap-2">
               <button>&lt;</button>
               <button>&gt;</button>
             </div>
           </div>

           {/* 요일 */}
           <div className="grid grid-cols-7 text-center text-sm text-gray-400 mb-4">/           {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
              <div key={day}>{day}</div>
        ))}
           </div>
           {/* 날짜 그리드 */}
         <div className="grid grid-cols-7 text-center gap-y-4">
           {[...Array(30)].map((_, i) => {
             const day = i + 1;
             // 22일 강조 (예시)
             const isSelected = day === 22;
             return (
               <div
                 key={day}
                 className={`w-8 h-8 flex items-center justify-center rounded-full text-sm
                   ${isSelected ? 'bg-orange-500 text-white font-bold' : 'text-gray-700'}`}
               >
                 {day}
               </div>
             );
           })}
         </div>
       </main>


      {/* 방명록 영역 */}
      <section className="max-w-md mx-auto mt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800">방 목록</h3>
        {/* 추가 버튼 */}
          <button 
            onClick={handleAdd}
            className="text-sm bg-orange-500 text-white px-4 py-1.5 rounded-xl font-medium shadow-md hover:bg-orange-600 transition active:scale-95"
          >
            추가
          </button>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-16 bg-white rounded-xl shadow-sm border border-gray-100"></div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MainPage;