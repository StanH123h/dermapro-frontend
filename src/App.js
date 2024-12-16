import './App.css';
import { BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import createRoutes from "./route/Route";
import { FeedPage } from "./pages/feed/FeedPage";
import { HistoryPage } from "./pages/history/HistoryPage";
import { ProfilePage } from "./pages/profile/ProfilePage";
import { DetectionResultPage } from "./pages/detectionresult/DetectionResultPage";
import SnapshotPage from "./pages/snapshot/SnapshotPage";
import { LoginPage } from "./pages/login/LoginPage";
import RegisterPage from "./pages/register/RegisterPage";
import { WelcomePage } from "./pages/welcome/WelcomePage";
import { DetailedReportPage } from "./pages/history/DetailedReportPage";
import { PhotoSnapButton } from "./components/PhotoSnapButton/PhotoSnapButton";
import React from "react";

function App() {
  // 获取当前路由路径
  const location = useLocation();  // 获取当前路径

  const routesConfig = [
    { path: '/', component: <FeedPage />, index: 0 },
    { path: '/history', component: <HistoryPage />, index: 1 },
    { path: '/profile', component: <ProfilePage />, index: 2 },
    { path: '/detection-result', component: <DetectionResultPage />, index: 3 },
    { path: '/snapshot', component: <SnapshotPage />, index: 4 },
    { path: '/login', component: <LoginPage />, index: 5 },
    { path: '/register', component: <RegisterPage />, index: 6 },
    { path: '/welcome', component: <WelcomePage />, index: 7 },
    { path: '/detailed-report-page', component: <DetailedReportPage /> },
    // {path:"/governmentCheckCarbonAmount",component: <CarbonAmountPage/>,index: 5}
  ];

  // 判断是否在 /profile, /history 或者 / 页面
  const showPhotoSnapButton = ['/profile', '/history', '/'].includes(location.pathname);

  return (
      <div>
        {showPhotoSnapButton && <PhotoSnapButton />}  {/* 如果在这3个页面时显示按钮 */}
        <Routes>
          {createRoutes(routesConfig)}
        </Routes>
      </div>
  );
}

function AppWithRouter() {
  return (
      <Router>
        <App />
      </Router>
  );
}

export default AppWithRouter;
