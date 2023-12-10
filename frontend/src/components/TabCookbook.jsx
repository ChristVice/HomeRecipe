import React from "react";
import Nav from "./Nav";

function TabCookbook() {
  return (
    <div className="dashboard-page">
      {/* Right Side Content */}
      <Nav currentTab={3} />
      <div className="right-side-panel">
        <div className="top-gradient" />
        <div>CookbookTab</div>
      </div>
    </div>
  );
}

export default TabCookbook;
