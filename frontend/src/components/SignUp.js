import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styling/LoginSignForm.css";

function SignUp() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async () => {
    try {
      const response = await axios.post("http://localhost:8000/api/signup/", {
        email,
        username,
        password,
      });
      if (response && response.status === 201) {
        // Handle successful sign up
        console.log("Sign up successful!");
        console.log(response.data);
        navigate("/"); // Redirect to the login page
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
    <div className="login-sign-form-section">
      <h1>
        Email<span>*</span>
      </h1>
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <h1>
        Username<span>*</span>
      </h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <h1>
        Password<span>*</span>
      </h1>
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <h1>
        Confirm Password<span>*</span>
      </h1>
      <input
        type="password"
        placeholder="Confirm Password"
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
