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

  return (
    <>
      {recipe && (
        <li className="calendar-upcoming-recipe-card">
          <img src={recipe.image_url} alt={recipe.recipe_label} />

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

              <p>
                <span>
                  {recipe.time_in_minutes < 1 ? "1" : recipe.time_in_minutes}
                </span>{" "}
                minutes
              </p>
            </div>
          </div>
        </li>
      )}
    </>
  );
}

export default CalendarRecipeCard;
