import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import SignUpPage from "./components/SignUpPage";
import TabHome from "./components/TabHome";
import TabCalendar from "./components/TabCalendar";
import TabCookbook from "./components/TabCookbook";

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
          path="/d/"
          element={
            <ProtectedRoute>
              <TabHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/d/home"
          element={
            <ProtectedRoute>
              <TabHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/d/calendar"
          element={
            <ProtectedRoute>
              <TabCalendar />
            </ProtectedRoute>
          }
        />
        <Route
          path="/d/cookbook"
          element={
            <ProtectedRoute>
              <TabCookbook />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
