import React from "react";
import { useNavigate } from "react-router-dom";

function DashboardPage() {
  const navigate = useNavigate();

  const handleLogOut = () => {
    console.log("Logging out");
    localStorage.removeItem("token"); // Remove the token from localStorage
    console.log(localStorage.getItem("token"));
    navigate("/"); // Redirect to the home page
  };

  const isAuthenticated = localStorage.getItem("token") !== null;

  if (isAuthenticated) {
    return (
      <div>
        <h1>Dashboard Landing Page</h1>
        <button onClick={handleLogOut}>Log out</button>
      </div>
    );
  } else {
    return <div>You are not authenticated</div>;
  }
}

export default DashboardPage;
