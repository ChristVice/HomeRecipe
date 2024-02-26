import React from "react";
import "../styling/CalendarRecipeCard.css";

function CalendarRecipeCard({ recipe }) {
  const handletest = () => {
    console.log(recipe);
  };
  const capitalizeFirstLetter = (string) => {
    if (string.includes("/")) {
      string = string.replace(/\/(.)/g, (_, char) => `/${char.toUpperCase()}`);
    }

    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleOpenLink = (url) => {
    console.log("clicked :: ", recipe.recipe_label);
    window.open(url, "_blank");
  };

  return (
    <>
      {recipe && (
        <li className="calendar-upcoming-recipe-card">
          <div
            className="calendar-upcoming-recipe-image"
            style={{
              backgroundImage: `url(${recipe.image_url})`,
            }}
          >
            <button
              className="image-hover-bttn"
              onClick={() => handleOpenLink(recipe.website_url)}
            >
              <svg
                width="21"
                height="21"
                viewBox="0 0 21 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.9468 0.445899C12.6168 0.620749 12.447 0.897594 12.4276 1.29586C12.4082 1.69899 12.5295 1.96612 12.8449 2.19925L13.0584 2.34982L15.1011 2.36439L17.1438 2.37896L12.6508 6.88135C9.46293 10.0724 8.12859 11.4469 8.05096 11.5974C7.96362 11.7674 7.94906 11.8743 7.96362 12.1171C7.98303 12.462 8.12859 12.7145 8.41972 12.9088C8.62836 13.0545 9.06505 13.0982 9.34162 13.0108C9.49689 12.9622 10.3848 12.0977 14.0821 8.40643L18.6286 3.85547V5.84196V7.82359L18.7547 8.06158C18.8275 8.18786 18.9731 8.35786 19.0798 8.43071C19.2545 8.55213 19.3176 8.56671 19.6524 8.56671C19.992 8.56671 20.0454 8.55213 20.2346 8.421C20.3462 8.33843 20.4918 8.17815 20.5549 8.06158L20.6665 7.84788V4.46259V1.0773L20.5549 0.863596C20.4918 0.747029 20.3462 0.581893 20.2346 0.504182L20.026 0.358474L16.5955 0.343904L13.1651 0.334189L12.9468 0.445899Z"
                  fill="white"
                />
                <path
                  d="M2.32545 3.51987C1.46662 3.74329 0.699987 4.36983 0.311817 5.16637C-0.0229794 5.84634 -0.00842302 5.42865 0.00613335 12.3595L0.0206897 18.6201L0.146845 18.9455C0.505902 19.8683 1.15123 20.5143 2.07314 20.8737L2.39823 21H8.73025H15.0623L15.4019 20.8931C16.3141 20.6017 17.0371 19.9023 17.4107 18.9455L17.5369 18.6201L17.5514 15.0405C17.566 11.5775 17.5611 11.4513 17.4689 11.2764C17.0662 10.4847 16.0181 10.4847 15.6154 11.2715C15.5281 11.4464 15.5232 11.6018 15.5232 14.7103C15.5232 17.0464 15.5087 18.0324 15.465 18.1975C15.3874 18.5084 15.0477 18.8484 14.7372 18.9261C14.4121 19.0087 3.14546 19.0087 2.82037 18.9261C2.50983 18.8484 2.17018 18.5084 2.09255 18.1975C2.04888 18.0276 2.03432 16.4636 2.03432 12.2186C2.03432 5.72492 2.01006 6.12319 2.39823 5.7832C2.52924 5.67149 2.70391 5.5695 2.83492 5.5355C2.98049 5.5015 4.06736 5.48207 6.28964 5.48207C9.34162 5.48207 9.54056 5.47236 9.72494 5.38979C10.5207 5.02066 10.5304 3.94242 9.7395 3.53444C9.56482 3.44701 9.40955 3.44216 6.07614 3.44701C3.20368 3.44701 2.54379 3.46158 2.32545 3.51987Z"
                  fill="white"
                />
              </svg>

              <p>Open Recipe</p>
            </button>
          </div>

          <div className="calendar-upcoming-recipe-content">
            <h1 onClick={handletest}>{recipe.recipe_label}</h1>
            <div className="calendar-upcoming-recipe-subcontent">
              <p>{capitalizeFirstLetter(recipe.cuisine_type)}</p>
              <p>{capitalizeFirstLetter(recipe.meal_type)}</p>
            </div>
            <div className="small-labels">
              <p>
                <span>{recipe.calories}</span> calories
              </p>

              {recipe.time_in_minutes < 1 ? (
                <h3
                  className="calendar-card-minutes"
                  style={{ color: "#519451", backgroundColor: "#DEEDDE" }}
                >
                  1 minute
                </h3>
              ) : recipe.time_in_minutes <= 10 ? (
                <h3
                  className="calendar-card-minutes"
                  style={{ color: "#519451", backgroundColor: "#DEEDDE" }}
                >
                  {recipe.time_in_minutes} minutes
                </h3>
              ) : recipe.time_in_minutes > 10 &&
                recipe.time_in_minutes <= 30 ? (
                <h3
                  className="calendar-card-minutes"
                  style={{ color: "#D9A112", backgroundColor: "#FCF2D9" }}
                >
                  {recipe.time_in_minutes} minutes
                </h3>
              ) : (
                <h3
                  className="calendar-card-minutes"
                  style={{ color: "#BA3523", backgroundColor: "#F4CBC6" }}
                >
                  {recipe.time_in_minutes} minutes
                </h3>
              )}
            </div>
          </div>
        </li>
      )}
    </>
  );
}

export default CalendarRecipeCard;
