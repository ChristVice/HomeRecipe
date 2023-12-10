import React from "react";
import "../styling/HomePage.css";
import SignUp from "./SignUp";
import Logo from "../images/webicon.png";
import { useNavigate } from "react-router-dom";
import "../styling/HomePage.css";

function SignUpPage() {
  const navigate = useNavigate();

  const handleSelectePage = () => {
    navigate("/login");
  };

  const SignupPage = () => {
    return (
      <div className="centered-content">
        <h1 className="main-title">Create Your Account</h1>
        <p className="main-title-sub">Let’s get started!</p>

        <div className="login-signup-section">
          <SignUp />

          <p className="signup-text">
            Already have an account?{" "}
            <span onClick={() => handleSelectePage()}>Log In</span>
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
            <div className="logo">
              <img src={Logo} alt="logo" />
            </div>
            <h1 className="title">HomeRecipe</h1>
          </div>
          <SignupPage />
        </div>
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

export default SignUpPage;
