import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styling/LoginSignForm.css";
import "../styling/SignUp.css";

import BulletImg from "../images/bulletcircle.png";
import CheckMarkImg from "../images/checkmark.png";

function SignUp() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");
  const navigate = useNavigate();

  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleSignUp = async () => {
    try {
      const response = await axios.post("http://localhost:8000/api/signup/", {
        email,
        username,
        password,
      });

      if (password !== password_confirmation) {
        console.error("passwords dont match");
      } else {
        // Do something with the valid form data, e.g., submit the form
        console.log("Form submitted successfully");
        if (response && response.status === 201) {
          // Handle successful sign up
          console.log("Sign up successful!");
          console.log(response.data);
          navigate("/"); // Redirect to the login page
        } else {
          console.error("Invalid response received");
          console.error(response.data);
        }
      }
    } catch (error) {
      if (error.response && error.response.data) {
        console.error(error.response.data); // Handle the error response here
      } else {
        console.error("An error occurred while processing the request");
      }
    }
  };

  const handlePasswordLength = () => {
    return password.length >= 8;
  };
  const handlePasswordCommon = () => {
    let commonPasswords = new Set([
      "123456",
      "123456789",
      "Qwerty",
      "Password",
      "12345",
      "12345678",
      "111111",
      "1234567",
      "123123",
      "Qwerty123",
      "1q2w3e",
      "1234567890",
      "DEFAULT",
      "0",
      "Abc123",
      "654321",
      "123321",
      "Qwertyuiop",
      "Iloveyou",
      "666666",
    ]);
    return password.length >= 8 && !commonPasswords.has(password);
  };
  const handlePasswordSimilar = () => {
    return (
      password.length >= 8 &&
      !password.includes(username) &&
      !password.includes(email)
    );
  };
  const handlePasswordNumeric = () => {
    const hasLetters = /[a-zA-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const isNotEntirelyNumeric = !/^\d+$/.test(password);

    return (
      password.length >= 8 && hasLetters && hasNumbers && isNotEntirelyNumeric
    );
  };

  return (
    <div className="login-sign-form-section">
      <h1>
        Email<span>*</span>
      </h1>
      <input
        type="text"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <h1>
        Username<span>*</span>
      </h1>
      <input
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <div className="password-container">
        <h1>
          Password<span>*</span>
        </h1>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="password-input"
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {isFocused && (
          <div className="requirements-box">
            <div className="checklist">
              <p>Your password must:</p>
              <ul>
                <li>
                  <img
                    src={handlePasswordLength() ? CheckMarkImg : BulletImg}
                    alt=""
                  />
                  Be at least 8 characters long
                </li>
                <li>
                  <img
                    src={handlePasswordSimilar() ? CheckMarkImg : BulletImg}
                    alt=""
                  />
                  Not be similar to other personal information
                </li>
                <li>
                  <img
                    src={handlePasswordCommon() ? CheckMarkImg : BulletImg}
                    alt=""
                  />
                  Not be a commonly used password
                </li>
                <li>
                  <img
                    src={handlePasswordNumeric() ? CheckMarkImg : BulletImg}
                    alt=""
                  />
                  Not be entirely numeric
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
      <h1>
        Confirm Password<span>*</span>
      </h1>
      <input
        type="password"
        placeholder="Retype your password"
        value={password_confirmation}
        onChange={(e) => setPasswordConfirmation(e.target.value)}
      />
      <button className="login-button" onClick={handleSignUp}>
        Sign Up
      </button>
    </div>
  );
}

export default SignUp;
