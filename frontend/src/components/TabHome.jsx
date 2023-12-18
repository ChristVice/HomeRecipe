import { useState } from "react";
import OpenLinkButton from "./OpenLinkButton";
import "../styling/TabHome.css";
import Nav from "./Nav";

function TabHome() {
  const [text, setText] = useState("");
  const [displayTxt, setDisplayTxt] = useState("");
  const [data, setData] = useState("");

  const appID = process.env.REACT_APP_APP_ID;
  const appKEY = process.env.REACT_APP_APP_KEY;
  const numberOfRecipes = 20; // Set the number of recipes you want to retrieve

  const [heartAnimate, setHeartAnimate] = useState([]);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      fetchData();
    }
  };

  const handleChange = (event) => {
    setText(event.target.value);
  };

  const capitalizeFirstLetter = (string) => {
    if (string.includes("/")) {
      string = string.replace(/\/(.)/g, (_, char) => `/${char.toUpperCase()}`);
    }

    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleLikesClick = (index) => {
    const updatedAnimations = [...heartAnimate];
    updatedAnimations[index] = !updatedAnimations[index];

    if (updatedAnimations[index] === true) {
      sendLikedRecipe(data.hits[index]);
    } else {
      removeLikedRecipe(data.hits[index]);
    }

    setHeartAnimate(updatedAnimations);
  };

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

  const removeLikedRecipe = (recipe) => {
    if (recipe.recipe && recipe.recipe.label) {
      return "unliked recipe :: " + recipe.recipe.label;
    }
    return "unliked recipe :: " + recipe;
  };

  const sendLikedRecipe = (recipe) => {
    const information = {
      recipeLabel: "",
      calories: "",
      imageURL: "",
    };

    if (recipe.recipe) {
      information["imageURL"] = getImageURL(recipe.recipe);
    }
    if (recipe.recipe && recipe.recipe.label) {
      information["recipeLabel"] = recipe.recipe.label;
    }
    if (recipe.recipe && recipe.recipe.calories) {
      information["calories"] = recipe.recipe.calories;
    }

    handleLikesBackend(information);
  };

  const handleLikesBackend = async (information) => {
    const data = {
      recipe_label: information["recipeLabel"],
      calories: parseFloat(information["calories"].toFixed(2)),
      //imageURL: information["imageURL"],
      // Add other fields if required by your serializer
    };

    const authToken = localStorage.getItem("token");
    console.log(authToken);

    try {
      const response = await fetch("http://localhost:8000/api/favorites/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${authToken}`, // Include the token in the Authorization header
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

  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://api.edamam.com/api/recipes/v2?to=${numberOfRecipes}&type=public&q=${text}&app_id=${appID}&app_key=${appKEY}`
      );
      if (response.ok) {
        const data = await response.json();

        console.log(data);
        setData(data);
        setDisplayTxt(text);
        setHeartAnimate(Array(numberOfRecipes).fill(false));
      } else {
        console.error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const Card = ({ information, index }) => {
    return (
      <div className={`results-content`}>
        <div
          className="result-pic"
          style={{
            backgroundImage: `url(${getImageURL(information)})`,
          }}
        />
        <div className="results-labels">
          <h1>{information.label}</h1>
          <div className="label-details">
            <h3> {capitalizeFirstLetter(information.cuisineType[0])}</h3>
            <h3>{capitalizeFirstLetter(information.mealType[0])}</h3>
          </div>

          <div className="label-details">
            <h3>{parseFloat(information.calories).toFixed(2)} calories</h3>
            {information.totalTime < 1 ? (
              <h3 className="green-light">{"< "}1 minute</h3>
            ) : information.totalTime <= 10 ? (
              <h3 className="green-light">{information.totalTime} minutes</h3>
            ) : information.totalTime > 10 && information.totalTime <= 30 ? (
              <h3 className="blue-light">{information.totalTime} minutes</h3>
            ) : (
              <h3 className="yellow-light">{information.totalTime} minutes</h3>
            )}
          </div>
        </div>
        <div className="result-buttons">
          <OpenLinkButton url={information.url} buttonText={"Show Recipe"} />
          <div className="saving-buttons">
            <svg
              className={`heart-icon ${
                heartAnimate[index] ? "liked-heart-icon" : ""
              }`}
              onClick={() => handleLikesClick(index)}
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
            <div className="save-cookbook"></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-page">
      {/* Right Side Content */}
      <Nav currentTab={1} />
      <div className="right-side-panel">
        <div className="top-gradient" />
        <div className="small-api-call">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search recipes!"
              onChange={handleChange}
              className="search-txt"
              onKeyDown={handleKeyPress}
            />
            <button className="search-btn" onClick={fetchData}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.71 16.29L14.31 12.9C15.407 11.5025 16.0022 9.77666 16 8C16 6.41775 15.5308 4.87103 14.6518 3.55544C13.7727 2.23985 12.5233 1.21447 11.0615 0.608967C9.59966 0.00346625 7.99113 -0.15496 6.43928 0.153721C4.88743 0.462403 3.46197 1.22433 2.34315 2.34315C1.22433 3.46197 0.462403 4.88743 0.153721 6.43928C-0.15496 7.99113 0.00346625 9.59966 0.608967 11.0615C1.21447 12.5233 2.23985 13.7727 3.55544 14.6518C4.87103 15.5308 6.41775 16 8 16C9.77666 16.0022 11.5025 15.407 12.9 14.31L16.29 17.71C16.383 17.8037 16.4936 17.8781 16.6154 17.9289C16.7373 17.9797 16.868 18.0058 17 18.0058C17.132 18.0058 17.2627 17.9797 17.3846 17.9289C17.5064 17.8781 17.617 17.8037 17.71 17.71C17.8037 17.617 17.8781 17.5064 17.9289 17.3846C17.9797 17.2627 18.0058 17.132 18.0058 17C18.0058 16.868 17.9797 16.7373 17.9289 16.6154C17.8781 16.4936 17.8037 16.383 17.71 16.29ZM2 8C2 6.81332 2.3519 5.65328 3.01119 4.66658C3.67047 3.67989 4.60755 2.91085 5.7039 2.45673C6.80026 2.0026 8.00666 1.88378 9.17055 2.11529C10.3344 2.3468 11.4035 2.91825 12.2426 3.75736C13.0818 4.59648 13.6532 5.66558 13.8847 6.82946C14.1162 7.99335 13.9974 9.19975 13.5433 10.2961C13.0892 11.3925 12.3201 12.3295 11.3334 12.9888C10.3467 13.6481 9.18669 14 8 14C6.4087 14 4.88258 13.3679 3.75736 12.2426C2.63214 11.1174 2 9.5913 2 8Z"
                  fill="black"
                />
              </svg>
            </button>
          </div>

          {data && data.hits && (
            <div>
              <h1 className="search-looking">
                Searched: <span>{displayTxt}</span>
              </h1>
              <div className="data-content">
                {data.hits.map((item, index) => (
                  <Card
                    key={index}
                    delay={(index + 0.0001) * 100}
                    information={item.recipe}
                    index={index}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TabHome;
