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

  //password checks
  const [isCommonPassword, setIsCommonPassword] = useState(false);
  const [isGoodLength, setIsGoodLength] = useState(false);
  const [isSimilar, setIsSimilar] = useState(false);
  const [isContainNumber, setIsContainNumber] = useState(false);

  const handleSignUp = async () => {
    try {
      const response = await axios.post("http://localhost:8000/api/signup/", {
        email,
        username,
        password,
      });

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

      /*
      These are all the checks for password
      */

      if (commonPasswords.has(password)) {
        console.error("Password is too common");
        setIsCommonPassword(!isCommonPassword);
        return;
      }
      if (password.length < 8) {
        console.error("Password must contain at least 8 characters");
        setIsGoodLength(!isGoodLength);
        return;
      }
      if (password.includes(email) || password.includes(username)) {
        console.error("Password is too similar to personal information");
        setIsSimilar(!isSimilar);
        return;
      }
      if (!/\D/.test(password)) {
        console.error(
          "Password must contain at least one non-numeric character"
        );
        setIsContainNumber(!isContainNumber);
        return;
      }

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
      <h1>
        Password<span>*</span>
      </h1>
      <input
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
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
