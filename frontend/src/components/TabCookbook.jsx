import React from "react";
import Nav from "./Nav";
import "../styling/TabCookbook.css"; // Import your CSS file for styling

function TabCookbook() {
  return (
    <div className="dashboard-page">
      <Nav currentTab={2} />
      <div className="right-side-panel">
        <div className="top-gradient" />
        <div>{/* CONTENT WILL GO HERE */}</div>
      </div>
    </div>
  );
}

export default TabCookbook;
