import React from "react";
import { useNavigate } from "react-router-dom";

function DashboardPage() {
  const navigate = useNavigate();
  let handleLogOut = () => {
    console.log("Loging out");
    navigate("/"); // Redirect to the dashboard page
  };

  return (
    <div>
      <h1>Dashboard Landing Page</h1>
      <button onClick={handleLogOut}>Log out</button>
    </div>
  );
}

export default DashboardPage;
