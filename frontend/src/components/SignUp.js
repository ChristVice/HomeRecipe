import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styling/SignUp.css";
import "../styling/LoginSignForm.css";

import BulletImg from "../images/bulletcircle.png";
import CheckMarkImg from "../images/checkmark.png";

function SignUp() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");
  const navigate = useNavigate();

  const [isFocused, setIsFocused] = useState(false);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSignUpAndLogin();
    }
  };

  //ERROR HANDLING
  const [errorHandling, setErrorHandling] = useState({
    email: false,
    username: false,
    passwordMatch: true, // Add passwordMatch to the initial state
  });

  useEffect(() => {}, [errorHandling]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  async function handleSignUpAndLogin() {
    try {
      const signUpResponse = await handleSignUp();

      if (signUpResponse && signUpResponse.success) {
        const loginResponse = await handleLogin(email, password);

        if (loginResponse && loginResponse.success) {
          console.log("Logged in successfully!");
          localStorage.setItem("token", loginResponse.data);
          navigate("/d/"); // Redirect to the dashboard newPasswordpage
        } else {
          console.error("Login failed");
        }
      } else {
        console.error("Sign up failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const handleSignUp = async () => {
    try {
      const response = await axios.post("http://localhost:8000/api/signup/", {
        email,
        username,
        password,
      });

      if (password !== password_confirmation) {
        setErrorHandling({
          email: errorHandling["email"],
          username: errorHandling["username"],
          passwordMatch: !errorHandling["passwordMatch"],
        });
        console.log("Password mismatch error");
      } else {
        setErrorHandling({
          email: false,
          username: false,
          passwordMatch: true,
        });

        if (response && response.status === 201) {
          return { success: true, data: response.data }; // Return success
        } else {
          console.error("Invalid response received");
          console.error(response.data);
          return { success: false, error: "Sign up failed" }; // Return failure
        }
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorHandling({
          email: error.response.data.hasOwnProperty("email"),
          username: error.response.data.hasOwnProperty("username"),
          passwordMatch: password === password_confirmation,
        });
      } else {
        console.error("An error occurred while processing the request");
        return { success: false, error: "Error signing up" }; // Return failure
      }
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:8000/api/login/", {
        username,
        password,
      });
      if (response && response.status === 200) {
        // Handle successful login
        if (response.data.token) {
          // If the token exists in the response data, log it to the console
          return { success: true, data: response.data }; // Return success
        } else {
          console.log("Login failed:", response.data.error);
        }
      } else {
        console.error("Invalid response received");
        console.error(response.data);
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
    <div className="login-sign-form-section" onKeyDown={handleKeyPress}>
      <div className="signup-input-label">
        {errorHandling["email"] ? (
          <h1>
            Email
            <p className="error-input">
              {" "}
              A user with this email already exists.<span>*</span>
            </p>
          </h1>
        ) : (
          <h1 className="no-error-input">
            Email
            <span>*</span>
          </h1>
        )}
      </div>
      <input
        type="text"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <div className="signup-input-label">
        {errorHandling["username"] ? (
          <h1>
            Username
            <p className="error-input">
              {" "}
              A user with that username already exists.<span>*</span>
            </p>
          </h1>
        ) : (
          <h1 className="no-error-input">
            Username
            <span>*</span>
          </h1>
        )}
      </div>
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
      <div className="signup-input-label">
        {!errorHandling["passwordMatch"] ? (
          <h1>
            Confirm Password
            <p className="error-input">
              {" "}
              Passwords do not match.<span>*</span>
            </p>
          </h1>
        ) : (
          <h1 className="no-error-input">
            Confirm Password
            <span>*</span>
          </h1>
        )}
      </div>
      <input
        type="password"
        placeholder="Retype your password"
        value={password_confirmation}
        onChange={(e) => setPasswordConfirmation(e.target.value)}
      />
      <button className="login-button" onClick={handleSignUpAndLogin}>
        Sign Up
      </button>
    </div>
  );
}

export default SignUp;
