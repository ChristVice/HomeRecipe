import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import TabHome from "./components/TabHome";
import DashboardPage from "./components/DashboardPage";
import TabCalendar from "./components/TabCalendar";
import TabCookbook from "./components/TabCookbook";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/dashboard/home" element={<TabHome />} />
        <Route path="/dashboard/meal-calendar" element={<TabCalendar />} />
        <Route path="/dashboard/cookbook" element={<TabCookbook />} />
      </Routes>
    </Router>
  );
  /*
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </Router>
  );
  */
}

export default App;
