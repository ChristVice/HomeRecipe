import React, { useState } from "react";
import "../styling/HeartButton.css";

function HeartButton({ recipeData }) {
  const [toggle, setToggle] = useState(false);

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
    console.log("this is a removed log :: ", recipeData);

    if (recipeData && recipeData.label) {
      return "unliked recipe :: " + recipeData.label;
    }
    return "unliked recipe :: " + recipeData.label;
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

    handleLikesBackend(data);
  };

  const handleLikesBackend = async (info) => {
    const data = {
      calories: parseFloat(info["calories"].toFixed(2)),
      recipe_label: info["recipeLabel"],
      cuisine_type: info["cuisineType"],
      meal_type: info["mealType"],
      time_in_minutes: info["timeMin"],
      ingredient_lines: info["ingredients"],
      image_url: info["imageURL"],
      website_url: info["websiteURL"],
    };

    const authToken = JSON.parse(localStorage.getItem("token"))["token"];

    try {
      const response = await fetch("http://localhost:8000/api/favorites/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken, // Include the token in the Authorization header
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData); // Log the response data if needed
        return responseData;
      } else {
        throw new Error("Failed to send favorite");
      }
    } catch (error) {
      console.error("Error sending favorite:", error);
      // Handle errors here, e.g., show an error message to the user
    }
  };

  const getLikedBackend = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/favorites/", {
        method: "GET",
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData); // Log the response data if needed
        return responseData;
      } else {
        throw new Error("Failed to send favorite");
      }
    } catch (error) {
      console.error("Error sending favorite:", error);
      // Handle errors here, e.g., show an error message to the user
    }
  };

  const deleteLikedBackend = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/favorites/", {
        method: "DELETE",
      });
      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData); // Log the response data if needed
        return responseData;
      } else {
        throw new Error("Failed to send favorite");
      }
    } catch (error) {
      console.error("Error sending favorite:", error);
    }
  };

  const handleProperFunction = () => {
    toggle ? removeLikedRecipe() : sendLikedRecipe();
    setToggle((prevToggle) => {
      const newToggle = !prevToggle;
      return newToggle;
    });
  };

  return (
    <div>
      <div className="saving-buttons">
        <svg
          className={`heart-icon ${toggle ? "liked-heart-icon" : ""}`}
          onClick={handleProperFunction}
          width="233"
          height="200"
          viewBox="0 0 233 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M114.317 194.123L114.285 194.091L114.253 194.06L33.1192 115.675L32.9523 115.514L32.7713 115.369C32.1553 114.875 31.1386 113.929 29.6569 112.403C28.3261 111.032 26.0543 108.36 22.7598 104.236C19.5996 100.28 16.7814 96.2319 14.3008 92.0917C11.9339 88.1411 9.75515 83.2437 7.80294 77.3372C5.91401 71.622 5 66.1623 5 60.9375C5 42.8421 10.1827 29.3282 20.0084 19.7209C29.8546 10.0935 43.6826 5 62.1507 5C66.9373 5 71.8857 5.82988 77.0153 7.54222C82.2039 9.27423 87.0113 11.6033 91.451 14.5273C96.168 17.6339 100.175 20.5157 103.492 23.173C106.816 25.8361 109.973 28.6643 112.962 31.658L116.5 35.2011L120.038 31.658C123.027 28.6643 126.184 25.8361 129.508 23.173C132.825 20.5157 136.832 17.6339 141.549 14.5273C145.989 11.6033 150.796 9.27423 155.985 7.54222C161.114 5.82988 166.063 5 170.849 5C189.317 5 203.145 10.0935 212.992 19.7209C222.817 29.3282 228 42.8421 228 60.9375C228 78.2786 219.045 96.602 199.72 115.965L118.75 194.057L118.716 194.09L118.683 194.123C118.082 194.725 117.457 195 116.5 195C115.543 195 114.918 194.725 114.317 194.123Z"
            strokeWidth="10"
          />
        </svg>
      </div>
    </div>
  );
}

export default HeartButton;
