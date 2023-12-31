import React from "react";
import LoginIn from "./LoginIn";
import Logo from "../images/homerecipelogo1.png";
import { useNavigate } from "react-router-dom";
import MainPageRightSection from "./MainPageRightSection";
import "../styling/HomePage.css";

function LoginPage() {
  const navigate = useNavigate();

  const handleSelectePage = () => {
    navigate("/signup");
  };

  const LoginPage = () => {
    return (
      <div className="centered-content">
        <h1 className="main-title">Log In</h1>
        <p className="main-title-sub">Sign in and let’s start cooking!</p>

        <div className="login-signup-section">
          <LoginIn />

          <p className="signup-text">
            Don't have an account?{" "}
            <span onClick={() => handleSelectePage()}>Sign up</span>
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="landing-page">
      <div className="left-section">
        <div className="left-content">
          <div className="title-logo">
            <img src={Logo} alt="logo" className="logo" />
            <h1 className="title">HomeRecipe</h1>
          </div>
          <LoginPage />
        </div>
      </div>

      <MainPageRightSection />
    </div>
  );
}

export default LoginPage;
