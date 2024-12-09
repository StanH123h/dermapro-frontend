import './App.css';
import {
  BrowserRouter as Router,
  Routes
} from 'react-router-dom';
import createRoutes from "./route/Route";
import {FeedPage} from "./pages/feed/FeedPage";
import {HistoryPage} from "./pages/history/HistoryPage";
import {ProfilePage} from "./pages/profile/ProfilePage";
import {DetectionResultPage} from "./pages/detectionresult/DetectionResultPage";
import SnapshotPage from "./pages/snapshot/SnapshotPage";
import {LoginPage} from "./pages/login/LoginPage";
import RegisterPage from "./pages/register/RegisterPage";
import {WelcomePage} from "./pages/welcome/WelcomePage";
import {DetailedReportPage} from "./pages/history/DetailedReportPage";

function App() {
  const routesConfig = [
    { path: '/', component: <FeedPage/>,index:0 },
      {path:'/history', component: <HistoryPage/>, index:1},
      {path:'/profile',component: <ProfilePage/>, index:2},
      {path:'/detection-result', component:<DetectionResultPage/>,index:3},
      {path:'/snapshot',component: <SnapshotPage/>,index:4},
      {path:'/login',component: <LoginPage/>,index:5},
      {path:'/register',component: <RegisterPage/>,index:6},
    {path:'/welcome',component: <WelcomePage/>,index:7},
    {path:'/detailed-report-page',component:<DetailedReportPage/>}
    // {path:"/governmentCheckCarbonAmount",component: <CarbonAmountPage/>,index: 5}
  ];

  return (
      <Router>
        <Routes>
          {createRoutes(routesConfig)}
        </Routes>
      </Router>
  );
}

export default App;
