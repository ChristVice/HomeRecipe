import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styling/LogIn.css";

function LoginIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:8000/api/login/", {
        username,
        password,
      });
      if (response && response.status === 200) {
        // Handle successful login
        console.log("Success!!");
        localStorage.setItem("token", response.data);
        navigate("/dashboard"); // Redirect to the dashboard page
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

  return (
    <div className="login-form-section">
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
