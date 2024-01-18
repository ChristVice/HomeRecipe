import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import SignUpPage from "./components/SignUpPage";
import TabHome from "./components/TabHome";
import TabCalendar from "./components/TabCalendar";
import TabCookbook from "./components/TabCookbook";
import Nav from "./components/Nav";
import "./styling/Nav.css";

function ProtectedRoute({ children }) {
  if (!localStorage.getItem("token")) {
    return <Navigate to="/" />;
  }
  return children;
}

function CheckToken({ children }) {
  if (localStorage.getItem("token")) {
    return <Navigate to="/d/" />;
  }
  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <CheckToken>
              <LoginPage />
            </CheckToken>
          }
        />
        <Route
          path="/signup"
          element={
            <CheckToken>
              <SignUpPage />
            </CheckToken>
          }
        />
        <Route
          path="/login"
          element={
            <CheckToken>
              <LoginPage />
            </CheckToken>
          }
        />

        <Route
          path="/d/*"
          element={
            <div className="dashboard-page">
              <ProtectedRoute>
                <Nav /> {/* Render Nav component for all /d/* routes */}
                <Routes>
                  {/* Render protected routes */}
                  <Route index element={<TabHome />} />
                  <Route path="home" element={<TabHome />} />
                  <Route path="calendar" element={<TabCalendar />} />
                  <Route path="cookbook" element={<TabCookbook />} />
                </Routes>
              </ProtectedRoute>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
