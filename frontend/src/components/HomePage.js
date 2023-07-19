import React from "react";
import "../styling/HomePage.css";
import LoginIn from "./LoginIn";
import SignUp from "./SignUp";

function HomePage() {
  return (
    <div className="landing-page">
      <div className="login-section">
        <LoginIn />
      </div>
      <br />

      <SignUp />
    </div>
  );
}

export default HomePage;
