import React, { useState } from "react";
import { handleDeleteFavorite, handlePostFavorites } from "./BackendMethods";
import "../styling/HeartButton.css";

function HeartButton({ recipeData, heartStyle, initialToggle = false }) {
  const [isActive, setIsActive] = useState(initialToggle);

  /*
  
  useEffect to track the toggle, if its changed to its opposite initialToggle, 
  do the appropriate function to handle what happens
  
  */

  const getImageURL = (apiURL) => {
    if (apiURL && apiURL.images) {
      if (apiURL.images.LARGE && apiURL.images.LARGE.url) {
        return apiURL.images.LARGE.url;
      } else if (apiURL.images.REGULAR && apiURL.images.REGULAR.url) {
        return apiURL.images.REGULAR.url;
      }
    }
    return apiURL.images.SMALL.url;
  };

  const removeLikedRecipe = () => {
    handleDeleteFavorite(getImageURL(recipeData));
  };

  const sendLikedRecipe = () => {
    const data = {
      calories: "",
      recipeLabel: "",
      cuisineType: "",
      mealType: "",
      timeMin: 0,
      ingredients: "",
      imageURL: "",
      websiteURL: "",
    };

    if (recipeData) {
      data["imageURL"] = getImageURL(recipeData);

      if (recipeData.calories !== null) {
        data["calories"] = recipeData.calories;
      }
      if (recipeData.label !== null) {
        data["recipeLabel"] = recipeData.label;
      }
      if (recipeData.cuisineType[0] !== null) {
        data["cuisineType"] = recipeData.cuisineType[0];
      }
      if (recipeData.mealType[0] !== null) {
        data["mealType"] = recipeData.mealType[0];
      }
      if (recipeData.totalTime !== null) {
        data["timeMin"] = recipeData.totalTime;
      }
      if (recipeData.ingredientLines !== null) {
        data["ingredients"] = recipeData.ingredientLines.join("&");
      }
      if (recipeData.url !== null) {
        data["websiteURL"] = recipeData.url;
      }
    }

    handlePostFavorites(data);
  };

  const handleProperFunction = () => {
    isActive ? removeLikedRecipe() : sendLikedRecipe();
    setIsActive((prevToggle) => {
      const newToggle = !prevToggle;
      return newToggle;
    });
  };

  return (
    <div className="heart-btn-stage" style={heartStyle}>
      <div
        className={`heart-icon ${isActive ? "heart-btn-is-active" : ""}`}
        onClick={() => {
          handleProperFunction();
        }}
      ></div>
    </div>
  );
}

export default HeartButton;
