import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styling/LoginSignForm.css";

function LoginIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });
      if (response && response.status === 200) {
        const responseData = await response.json(); // Parse response to JSON
        if (responseData.token) {
          // Check for token in responseData
          localStorage.setItem("token", JSON.stringify(responseData));
          navigate("/d/");
        } else {
          console.log("Login failed:", responseData.error);
        }
      } else {
        console.error("Invalid response received");
        console.error(response);
      }
    } catch (error) {
      console.log("are we here??");
      if (error.response && error.response.data) {
        console.error(error.response.data); // Handle the error response here
      } else {
        console.error("An error occurred while processing the request");
      }
    }
  };

  return (
    <div className="login-sign-form-section" onKeyDown={handleKeyPress}>
      <h1>
        Username<span>*</span>
      </h1>
      <input
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <h1>
        Password<span>*</span>
      </h1>
      <input
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="login-button" onClick={handleLogin}>
        Login
      </button>
    </div>
  );
}

export default LoginIn;
