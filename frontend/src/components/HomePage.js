import React from "react";
import "../styling/HomePage.css";
import LoginIn from "./LoginIn";

function HomePage() {
  return (
    <div className="landing-page">
      <div className="login-section">
        <LoginIn />
      </div>
    </div>
  );
}

export default HomePage;
