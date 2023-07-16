import React from "react";
import Blur from "../images/blur.png";
import "../styling/HomePage.css";
import LoginIn from "./LoginIn";

function HomePage() {
  // <img className="landing-page-image" src={Blur} alt="My Image" />
  return (
    <div className="landing-page">
      <div className="login-section">
        <LoginIn />
      </div>
    </div>
  );
}

export default HomePage;
