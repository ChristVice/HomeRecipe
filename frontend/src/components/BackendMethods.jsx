export const handleGetUsername = async () => {
  const authToken = JSON.parse(localStorage.getItem("token"))["token"];

  try {
    const response = await fetch("http://localhost:8000/api/user/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${authToken}`, // Include the token in the Authorization header
      },
    });

    if (response.ok) {
      const responseData = await response.json();
      return responseData;
    } else {
      throw new Error("Failed to send favorite");
    }
  } catch (error) {
    console.error(error);
  }
};

/**
 *
 * @param folderName Folder which will be return its associated recipes, "ALL" will return all folders
 * @returns List of recipes
 */
export const handleGetFoldersBackend = async (folderName) => {
  const authToken = JSON.parse(localStorage.getItem("token"))["token"];
  try {
    const response = await fetch(
      `http://localhost:8000/api/folder/${folderName}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${authToken}`, // Include the token in the Authorization header
        },
      }
    );

    if (response.ok) {
      const responseData = await response.json();
      return responseData;
    } else {
      throw new Error("Failed to post folder");
    }
  } catch (error) {
    return "Error posting folder :: " + error;
    // Handle errors here, e.g., show an error message to the user
  }
};

/**
 *
 * @param folderName Folder which will be posted to the backend to current user logged in
 * @returns backend message either successful or failure
 */
export const handlePostFolderBackend = async (folderName) => {
  const authToken = JSON.parse(localStorage.getItem("token"))["token"];
  const data = {
    folder_name: folderName,
  };

  try {
    const response = await fetch("http://localhost:8000/api/folder/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${authToken}`, // Include the token in the Authorization header
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const responseData = await response.json();
      return responseData;
    } else {
      throw new Error("Failed to post folder");
    }
  } catch (error) {
    return "Error posting folder :: " + error;
    // Handle errors here, e.g., show an error message to the user
  }
};

// HANDLE FAVORITES MODEL BACKEND
/**
 *
 * @param {Takes info data points to send to the backend}
 * @returns
 */
export const handlePostFavorites = async (info) => {
  const authToken = JSON.parse(localStorage.getItem("token"))["token"];
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

  try {
    const response = await fetch("http://localhost:8000/api/favorites/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${authToken}`, // Include the token in the Authorization header
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const responseData = await response.json();
      return responseData;
    } else {
      throw new Error("Failed to send favorite");
    }
  } catch (error) {
    console.error("Error sending favorite:", error);
    // Handle errors here, e.g., show an error message to the user
  }
};

/**
 *
 * @param {Takes imageURL as key indicator for recipe being deleted} info
 * @returns
 */
export const handleDeleteFavorite = async (imageURL) => {
  const authToken = JSON.parse(localStorage.getItem("token"))["token"];
  const data = {
    imageURL: imageURL,
  };

  try {
    const response = await fetch("http://localhost:8000/api/favorites/", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${authToken}`, // Include the token in the Authorization header
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const responseData = await response.json();
      return responseData;
    } else {
      throw new Error("Failed to send favorite");
    }
  } catch (error) {
    console.error("Error sending favorite:", error);
  }
};

/**
 *
 * @returns All Favorite items by current user logged in
 */
export const handleGetFavorites = async () => {
  const authToken = JSON.parse(localStorage.getItem("token"))["token"];

  try {
    const response = await fetch("http://localhost:8000/api/favorites/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${authToken}`, // Include the token in the Authorization header
      },
    });

    if (response.ok) {
      const responseData = await response.json();
      return responseData;
    } else {
      throw new Error("Failed to send favorite");
    }
  } catch (error) {
    console.error("Error sending favorite:", error);
    // Handle errors here, e.g., show an error message to the user
  }
};
