import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  handleDeleteFolderBackend,
  handleGetFoldersBackend,
  handleRenameFoldersBackend,
} from "./BackendMethods";

import "../styling/CookbookFolderPage.css";

function CookbookFolderPage() {
  const navigate = useNavigate();
  const { folderName } = useParams();
  const [folderRecipes, setFolderRecipes] = useState([]);
  const [isFolderOptionsOpen, setIsFolderOptionsOpen] = useState(false);

  useEffect(() => {
    handleGetFoldersBackend(folderName)
      .then((data) => {
        setFolderRecipes(data.result[folderName]);
      })
      .catch((error) => console.error(error));
  }, [folderName]);

  const handleGoToPrevPage = () => {
    navigate("/d/cookbook"); // Redirect to the home page
  };

  const handleFolderOption = (option) => {
    if (option === "rename") {
      console.log("rename folder");
      /*
      
      handleRenameFoldersBackend(folderName, "").then((data) => {
        if (data["success"]) {
            navigate("/d/cookbook");
            }
        });
      
      */
    } else if (option === "trash") {
      console.log("trash folder");
      handleDeleteFolderBackend(folderName).then((data) => {
        if (data["success"]) {
          navigate("/d/cookbook");
        }
      });
    }

    setIsFolderOptionsOpen(false);
  };

  return (
    <div className="right-side-panel">
      <div className="bttn-titles">
        <button className="back-bttn" onClick={handleGoToPrevPage}>
          Cookbooks
        </button>

        <svg
          className="arrow-icon"
          width="8"
          height="14"
          viewBox="0 0 8 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 1L7 7L1 13"
            stroke="black"
            strokeWidth="2"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <button
          className="folder-bttn"
          onClick={() => setIsFolderOptionsOpen(!isFolderOptionsOpen)}
          onBlur={() => setIsFolderOptionsOpen(false)}
          style={
            isFolderOptionsOpen
              ? {
                  backgroundColor: "#D2DCE1",
                  borderRadius: "10px 10px 0px 0px",
                }
              : {}
          }
        >
          {folderName}
          {isFolderOptionsOpen && (
            <ul className="folder-options">
              <li onClick={() => handleFolderOption("rename")}>
                <svg
                  className="rename-icon"
                  width="100"
                  height="87"
                  viewBox="0 0 100 87"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M33.44 39.3591C35.27 37.5291 37.752 36.501 40.34 36.501C41.6214 36.501 42.8903 36.7534 44.0743 37.2438C45.2582 37.7342 46.3339 38.4529 47.24 39.3591C48.1461 40.2652 48.8649 41.3409 49.3553 42.5248C49.8457 43.7087 50.0981 44.9776 50.0981 46.2591C50.0981 47.5405 49.8457 48.8094 49.3553 49.9933C48.8649 51.1772 48.1461 52.2529 47.24 53.1591L22.4 77.999L4 82.599L8.6 64.199L33.44 39.3591Z"
                    stroke="#5E7C8D"
                    strokeWidth="11"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4 43.4999V13.5999C4 11.1599 4.96928 8.81985 6.69462 7.09452C8.41995 5.36918 10.76 4.3999 13.2 4.3999H31.14C34.36 4.3999 37.12 5.7799 38.96 8.5399L42.64 14.0599C44.48 16.8199 47.24 18.1999 50.46 18.1999H86.8C89.24 18.1999 91.58 19.1692 93.3054 20.8945C95.0307 22.6199 96 24.9599 96 27.3999V73.3999C96 75.8399 95.0307 78.1799 93.3054 79.9053C91.58 81.6306 89.24 82.5999 86.8 82.5999H43.1"
                    stroke="#5E7C8D"
                    strokeWidth="11"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Rename
              </li>
              <li onClick={() => handleFolderOption("trash")}>
                <svg
                  className="trash-icon"
                  width="58"
                  height="64"
                  viewBox="0 0 58 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.5556 51.2C23.4101 51.2 24.2297 50.8629 24.834 50.2627C25.4383 49.6626 25.7778 48.8487 25.7778 48V28.8C25.7778 27.9513 25.4383 27.1374 24.834 26.5373C24.2297 25.9371 23.4101 25.6 22.5556 25.6C21.701 25.6 20.8814 25.9371 20.2771 26.5373C19.6728 27.1374 19.3333 27.9513 19.3333 28.8V48C19.3333 48.8487 19.6728 49.6626 20.2771 50.2627C20.8814 50.8629 21.701 51.2 22.5556 51.2ZM54.7778 12.8H41.8889V9.6C41.8889 7.05392 40.8704 4.61212 39.0576 2.81178C37.2447 1.01143 34.786 0 32.2222 0H25.7778C23.214 0 20.7553 1.01143 18.9424 2.81178C17.1296 4.61212 16.1111 7.05392 16.1111 9.6V12.8H3.22222C2.36764 12.8 1.54805 13.1371 0.943767 13.7373C0.339483 14.3374 0 15.1513 0 16C0 16.8487 0.339483 17.6626 0.943767 18.2627C1.54805 18.8629 2.36764 19.2 3.22222 19.2H6.44444V54.4C6.44444 56.9461 7.46289 59.3879 9.27575 61.1882C11.0886 62.9886 13.5474 64 16.1111 64H41.8889C44.4526 64 46.9114 62.9886 48.7243 61.1882C50.5371 59.3879 51.5556 56.9461 51.5556 54.4V19.2H54.7778C55.6324 19.2 56.452 18.8629 57.0562 18.2627C57.6605 17.6626 58 16.8487 58 16C58 15.1513 57.6605 14.3374 57.0562 13.7373C56.452 13.1371 55.6324 12.8 54.7778 12.8ZM22.5556 9.6C22.5556 8.75131 22.895 7.93738 23.4993 7.33726C24.1036 6.73714 24.9232 6.4 25.7778 6.4H32.2222C33.0768 6.4 33.8964 6.73714 34.5007 7.33726C35.105 7.93738 35.4444 8.75131 35.4444 9.6V12.8H22.5556V9.6ZM45.1111 54.4C45.1111 55.2487 44.7716 56.0626 44.1673 56.6627C43.5631 57.2629 42.7435 57.6 41.8889 57.6H16.1111C15.2565 57.6 14.4369 57.2629 13.8327 56.6627C13.2284 56.0626 12.8889 55.2487 12.8889 54.4V19.2H45.1111V54.4ZM35.4444 51.2C36.299 51.2 37.1186 50.8629 37.7229 50.2627C38.3272 49.6626 38.6667 48.8487 38.6667 48V28.8C38.6667 27.9513 38.3272 27.1374 37.7229 26.5373C37.1186 25.9371 36.299 25.6 35.4444 25.6C34.5899 25.6 33.7703 25.9371 33.166 26.5373C32.5617 27.1374 32.2222 27.9513 32.2222 28.8V48C32.2222 48.8487 32.5617 49.6626 33.166 50.2627C33.7703 50.8629 34.5899 51.2 35.4444 51.2Z"
                    fill="#5E7C8D"
                  />
                </svg>
                Move to trash
              </li>
            </ul>
          )}
        </button>
      </div>

      {folderRecipes.map((recipe, index) => {
        return <h3 key={index}>{recipe.recipe_label}</h3>;
      })}
    </div>
  );
}

export default CookbookFolderPage;
