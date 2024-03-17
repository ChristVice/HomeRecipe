import React from "react";
import { useParams } from "react-router-dom";

function CookbookFolderPage() {
  const { folderName } = useParams();

  const goToPrevPage = () => {
    console.log("Go to previous page");
    window.history.back();
  };

  return (
    <div className="right-side-panel">
      <button className="back-buttn" onClick={goToPrevPage}>
        Previous Page
      </button>
      <h1>{folderName}</h1>
      {/* Display saved recipes for the folder */}
    </div>
  );
}

export default CookbookFolderPage;
