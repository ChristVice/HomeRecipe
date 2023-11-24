import React from "react";
import "../styling/OpenLinkButton.css";

const OpenLinkButton = ({ url, buttonText }) => {
  const handleButtonClick = () => {
    window.open(url, "_blank");
  };

  return (
    <button className="open-recipe-link-btn" onClick={handleButtonClick}>
      {buttonText}
    </button>
  );
};

export default OpenLinkButton;
