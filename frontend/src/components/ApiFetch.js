import React, { useState } from "react";
import axios from "axios";

function ApiFetch() {
  /*
  const [text, setText] = useState("");
  const [data, setData] = useState(null);
  const [showImage, setShowImage] = useState(false);

  const options = {
    method: "GET",
    url: "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch",
    headers: {
      "X-RapidAPI-Key": "7334443819mshca1cc7c3f095e05p19aec6jsnd84ff8174993",
      "X-RapidAPI-Host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
    },
  };

  const fetchData = async () => {
    console.log(text);
    try {
      const response = await axios.get(options.url, {
        params: {
          query: text,
          instructionsRequired: "true",
          fillIngredients: "false",
          addRecipeInformation: "true",
        },
        headers: options.headers,
      });
      console.log("data :: ", response.data);
      setData(response.data);
      setShowImage(true); // Show the image
    } catch (error) {
      console.error("Error fetching data :: ", error);
    }
  };

  const handleChange = (event) => {
    setText(event.target.value);
  };

  const showData = (event) => {
    fetchData();
  };

  return (
    <div className="small-api-call">
      <h1>Hello</h1>
      <input type="text" value={text} onChange={handleChange} />
      <br />
      <button onClick={showData}>API will look for {text}</button>
      <br />
      <br />

      {data.results.map(
        (item) => showImage && data && <img src={item.image} alt="Recipe" />
      )}
    </div>
  );
  */

  return <div>Something here</div>;
}

export default ApiFetch;
