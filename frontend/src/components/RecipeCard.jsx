import React, { useState, useEffect, useRef } from "react";
import HeartButton from "./HeartButton";
import "../styling/RecipeCard.css";
import "../styling/EtcButton.css";

import { useDrag } from "react-dnd";
import { handlePostToFolderBackend } from "./BackendMethods";

function RecipeCard({ recipeData, folders }) {
  const [{ isDragging }, drag, preview] = useDrag({
    type: "RECIPE CARD",
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    item: { id: recipeData.recipeID },
  });

  const [isEtcActive, setIsEtcActive] = useState(false);

  useEffect(() => {
    // Attach the previewRef to the preview element after the component mounts
    preview(previewRef.current);
  }, [preview]);

  const truncateString = (inputString) => {
    const words = inputString.split(" ");

    const maxWords = 3;
    if (words.length > maxWords) {
      const truncatedString = words.slice(0, maxWords).join(" ");
      // Check if the last character of the truncated string is a comma
      if (truncatedString.endsWith(",")) {
        // Remove the comma before adding '...'
        return truncatedString.slice(0, -1) + "...";
      } else {
        return truncatedString + "...";
      }
    }

    return inputString;
  };

  const HoverLabel = ({ text, children }) => {
    const [showLabel, setShowLabel] = useState(false);

    const handleMouseEnter = () => {
      setShowLabel(true);
    };

    const handleMouseLeave = () => {
      setShowLabel(false);
    };

    return (
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          position: "relative",
          display: "inline-block",
          marginRight: "auto",
        }}
      >
        {children}
        {showLabel && truncateString(text).includes("...") && (
          <div
            style={{
              position: "absolute",
              zIndex: 101,
              top: "100%",
              left: -10,
              background: "rgba(0, 0, 0, 0.7)",
              color: "#fff",
              padding: "4px",
              borderRadius: "4px",
              whiteSpace: "pre-wrap",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "12px",
            }}
          >
            {text}
          </div>
        )}
      </div>
    );
  };

  const capitalizeFirstLetter = (string) => {
    if (string.includes("/")) {
      string = string.replace(/\/(.)/g, (_, char) => `/${char.toUpperCase()}`);
    }

    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleOpenLink = (url) => {
    window.open(url, "_blank");
  };

  // Initialize the previewRef using useRef
  const previewRef = useRef(null);

  const handleEtcShowOptions = (e) => {
    e.stopPropagation();

    setIsEtcActive(!isEtcActive);
  };

  const handleAddToFolder = (folderName) => {
    console.log("moving ", recipeData.recipe_label, " to ", folderName);
    // handlePostToFolderBackend(folderName, recipeData.recipeID);

    setIsEtcActive(false);
  };

  return (
    <div
      className="recipe-card-canvas"
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1, // Change opacity when dragging
      }}
    >
      <div className="recipe-card-image-box">
        <img src={recipeData.image_url} alt={recipeData.recipe_label} />
        <div className="options-btn-bkg">
          <HeartButton
            className="testing-heart-resizing"
            isHearted={true}
            heartStyle={{ top: "2%" }}
            recipeData={recipeData}
          />
          <div className="save-to-folder-content">
            <button
              className="save-to-folder-button"
              onClick={handleEtcShowOptions}
              onBlur={() => setIsEtcActive(false)}
            >
              {/*

              <svg
                viewBox="0 0 5 19"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.201 7C1.91196 7 1.62575 7.05693 1.35871 7.16754C1.09168 7.27815 0.84904 7.44028 0.644658 7.64466C0.440277 7.84904 0.278152 8.09168 0.167541 8.35871C0.0569306 8.62575 2.27602e-07 8.91196 2.27602e-07 9.201C2.27602e-07 9.49004 0.0569306 9.77625 0.167541 10.0433C0.278152 10.3103 0.440277 10.553 0.644658 10.7573C0.84904 10.9617 1.09168 11.1238 1.35871 11.2345C1.62575 11.3451 1.91196 11.402 2.201 11.402C2.78474 11.4019 3.34452 11.1698 3.7572 10.757C4.16987 10.3441 4.40163 9.78424 4.4015 9.2005C4.40137 8.61676 4.16935 8.05698 3.75649 7.6443C3.34363 7.23163 2.78374 6.99987 2.2 7H2.201ZM2.201 4.4C2.48991 4.39987 2.77596 4.34283 3.04283 4.23215C3.30969 4.12147 3.55215 3.95931 3.75634 3.75493C3.96054 3.55055 4.12248 3.30795 4.23292 3.04098C4.34336 2.77401 4.40013 2.48791 4.4 2.199C4.39987 1.91009 4.34283 1.62404 4.23215 1.35717C4.12147 1.09031 3.95931 0.847854 3.75493 0.643658C3.55055 0.439462 3.30795 0.277522 3.04098 0.167083C2.77401 0.0566435 2.48791 -0.000131095 2.199 2.27294e-07C1.61552 0.000265452 1.05605 0.232305 0.643658 0.645072C0.231265 1.05784 -0.000264989 1.61752 2.27602e-07 2.201C0.000265444 2.78448 0.232305 3.34395 0.645072 3.75634C1.05784 4.16873 1.61752 4.40027 2.201 4.4ZM2.201 14C1.61726 14 1.05743 14.2319 0.644658 14.6447C0.231891 15.0574 2.27602e-07 15.6173 2.27602e-07 16.201C2.27602e-07 16.7847 0.231891 17.3446 0.644658 17.7573C1.05743 18.1701 1.61726 18.402 2.201 18.402C2.78474 18.402 3.34457 18.1701 3.75734 17.7573C4.17011 17.3446 4.402 16.7847 4.402 16.201C4.402 15.6173 4.17011 15.0574 3.75734 14.6447C3.34457 14.2319 2.78474 14 2.201 14Z"
                  fill="black"
                />
              </svg>


*/}
              <svg
                viewBox="0 0 20 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 9.36364C20 9.59849 19.89 9.84849 19.67 10.1136L16.0937 14.6136C15.7885 15 15.361 15.3277 14.8111 15.5966C14.2611 15.8655 13.752 16 13.2837 16H1.70304C1.46177 16 1.24712 15.9508 1.05907 15.8523C0.87103 15.7538 0.777009 15.5909 0.777009 15.3636C0.777009 15.1288 0.886998 14.8788 1.10698 14.6136L4.68334 10.1136C4.98847 9.72728 5.416 9.39962 5.96594 9.13069C6.51588 8.86175 7.02501 8.72728 7.49335 8.72728H19.074C19.3152 8.72728 19.5299 8.77652 19.7179 8.87501C19.906 8.97349 20 9.13637 20 9.36364ZM16.3491 5.45456V7.27273H7.49335C6.82632 7.27273 6.12737 7.45266 5.39648 7.81251C4.66561 8.17235 4.08374 8.625 3.65088 9.17046L0.0638616 13.6705L0.0106473 13.7386C0.0106473 13.7083 0.00887277 13.661 0.00532366 13.5966C0.00177455 13.5322 0 13.4849 0 13.4546V2.54546C0 1.84849 0.234167 1.25 0.7025 0.749998C1.17083 0.25 1.73142 0 2.38425 0H5.79031C6.44314 0 7.00372 0.25 7.47207 0.749998C7.9404 1.25 8.17456 1.84848 8.17456 2.54546V2.90909H13.9649C14.6177 2.90909 15.1783 3.15909 15.6466 3.65909C16.115 4.15909 16.3491 4.75757 16.3491 5.45455V5.45456Z"
                  fill="#ABABAB"
                />
              </svg>

              {isEtcActive && folders && folders["folders"] && (
                <div className="save-to-folder-options">
                  {folders["folders"].map((folderName, index) => {
                    return (
                      <p
                        key={index}
                        onClick={() => handleAddToFolder(folderName)}
                      >
                        {folderName}
                      </p>
                    );
                  })}
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="recipe-card-information-box">
        <div className="recipe-card-labels">
          <h1 ref={previewRef} className="drag-preview-content">
            {truncateString(recipeData.recipe_label)}
          </h1>

          <HoverLabel text={recipeData.recipe_label}>
            <h1 className="recipe-title">
              {truncateString(recipeData.recipe_label)}
            </h1>
          </HoverLabel>

          <div className="small-labels">
            <p>{capitalizeFirstLetter(recipeData.cuisine_type)}</p>
            <p>{capitalizeFirstLetter(recipeData.meal_type)}</p>
          </div>
          <div className="small-labels">
            <p>
              <span>{recipeData.calories}</span> calories
            </p>

            <p>
              <span>
                {recipeData.time_in_minutes < 1
                  ? "1"
                  : recipeData.time_in_minutes}
              </span>{" "}
              minutes
            </p>
          </div>
        </div>
        <button
          className="recipe-card-openlink-btn"
          onClick={() => handleOpenLink(recipeData.website_url)}
        >
          <svg
            className="openlink-icon"
            width="500"
            height="500"
            viewBox="0 0 500 500"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M313.226 2.70261C305.244 6.93305 301.135 13.6312 300.665 23.2672C300.196 33.0208 303.131 39.4839 310.761 45.1245L315.926 48.7674L365.349 49.1199L414.772 49.4725L306.065 158.406C228.938 235.612 196.654 268.868 194.776 272.511C192.663 276.624 192.311 279.209 192.663 285.084C193.132 293.428 196.654 299.538 203.698 304.239C208.746 307.764 219.311 308.822 226.003 306.707C229.759 305.532 251.242 284.614 340.697 195.305L450.695 85.1962V133.259V181.204L453.747 186.962C455.508 190.017 459.029 194.13 461.612 195.893C465.838 198.83 467.364 199.183 475.465 199.183C483.682 199.183 484.974 198.83 489.552 195.658C492.252 193.66 495.774 189.782 497.3 186.962L500 181.791V99.8852V17.9792L497.3 12.8087C495.774 9.98836 492.252 5.99295 489.552 4.11275L484.504 0.587387L401.507 0.23485L318.509 -0.000174327L313.226 2.70261Z"
              fill="black"
            />
            <path
              d="M56.258 77.0731C35.4793 82.4786 16.9311 97.6377 7.53959 116.91C-0.560585 133.361 -0.208404 123.255 0.143777 290.945L0.495959 442.419L3.5482 450.292C12.2353 472.619 27.8487 488.248 50.1535 496.944L58.0189 500H211.218H364.417L372.634 497.414C394.704 490.364 412.196 473.442 421.235 450.292L424.288 442.419L424.64 355.812C424.992 272.026 424.875 268.971 422.644 264.74C412.9 245.586 387.543 245.586 377.8 264.623C375.687 268.853 375.569 272.613 375.569 347.821C375.569 404.345 375.217 428.2 374.161 432.195C372.282 439.716 364.065 447.942 356.551 449.822C348.686 451.82 76.0976 451.82 68.2322 449.822C60.719 447.942 52.5014 439.716 50.6231 432.195C49.5666 428.082 49.2144 390.243 49.2144 287.537C49.2144 130.424 48.6274 140.06 58.0189 131.834C61.1886 129.131 65.4147 126.663 68.5844 125.841C72.1062 125.018 98.4024 124.548 152.169 124.548C226.01 124.548 230.823 124.313 235.284 122.315C254.536 113.384 254.771 87.2966 235.636 77.4256C231.41 75.3104 227.653 75.1929 147.003 75.3104C77.5063 75.3104 61.5407 75.6629 56.258 77.0731Z"
              fill="black"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default RecipeCard;
