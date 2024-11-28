import './App.css';
import {
  BrowserRouter as Router,
  Routes
} from 'react-router-dom';
import createRoutes from "./route/Route";
import {FeedPage} from "./pages/feed/FeedPage";
import {HistoryPage} from "./pages/history/HistoryPage";
import {ProfilePage} from "./pages/profile/ProfilePage";
import {DetectionPage} from "./pages/detectionresult/DetectionPage";
import SnapshotPage from "./pages/SnapshotPage/SnapshotPage";

function App() {
  const routesConfig = [
    { path: '/', component: <FeedPage/>,index:0 },
      {path:'/history', component: <HistoryPage/>, index:1},
      {path:'/profile',component: <ProfilePage/>, index:2},
      {path:'/detection-results', component:<DetectionPage/>,index:3},
      {path:'/snapshot',component: <SnapshotPage/>,index:4},
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
