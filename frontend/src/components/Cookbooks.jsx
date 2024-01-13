import React from "react";
import "../styling/Cookbooks.css";
import FolderModal from "./FolderModal";

function Cookbooks() {
  return (
    <div className="tabcookbook-cookbooks-section">
      <h1 className="cookbook-subtitle">Personalized Cookbooks</h1>

      <FolderModal />
    </div>
  );
}

export default Cookbooks;
