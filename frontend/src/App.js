import { BrowserRouter as Router, Route, Navigate } from "react-router-dom";
import { Routes } from "react-router";
import DashboardPage from "./components/DashboardPage";
import HomePage from "./components/HomePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </Router>
  );
}

export default App;
