import React from "react";
import "../styling/HomePage.css";
import LoginIn from "./LoginIn";
// import SignUp from "./SignUp";
//import mainBkg from "../images/chad-montano-MqT0asuoIcU-unsplash.jpg";

function HomePage() {
  return (
    <div className="landing-page">
      <div className="left-section">
        <LoginIn />
      </div>
      <div className="right-section">
        <div className="main-image">
          <div className="image-overlay"></div>
          <div className="text-overlay">
            <h1 className="large-pic-text">SIMPLE AND TASTY RECIPES</h1>
            <p className="small-pic-text">
              A recipe is soulless. The essence of the recipe must come from
              you, the cook.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
