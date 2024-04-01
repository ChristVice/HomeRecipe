import React, { useState } from "react";
import { ReactComponent as CookbookIcon } from "../images/dashboard/cookbook-icon.svg";
import { useNavigate } from "react-router-dom";
import "../styling/FolderTemplate.css";

import { useDrop } from "react-dnd";
import {
  handlePostToFolderBackend,
  handleDeleteFolderBackend,
  handleRenameFoldersBackend,
} from "./BackendMethods";

function FolderTemplate({ folderData: initialFolderData }) {
  // Make a copy of folderData using the spread operator
  const [folderData, setFolderData] = useState({ ...initialFolderData });
  const [isMouseHoveringTitle, setisMouseHoveringTitle] = useState(false);
  const [isEtcActive, setIsEtcActive] = useState(false);
  const navigate = useNavigate();

  const [{ isHovering }, drop] = useDrop({
    accept: "RECIPE CARD",
    collect: (monitor) => ({
      isHovering: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
    drop: (item) => {
      // Handle the drop event, and access the recipeID from the dragged item
      const droppedRecipeID = item.id;
      const droppedFolder = folderData.folderName;

      handlePostToFolderBackend(droppedFolder, droppedRecipeID).then((data) => {
        console.log(data);
        if (data["success"]) {
          //if drop is successful
          setFolderData({
            ...folderData,
            folderLength: folderData.folderLength + 1,
          });
        }
      });
    },
  });

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
      handleDeleteFolderBackend(folderData.folderName).then((data) => {
        if (data["success"]) {
          navigate("/d/cookbook");
        }
      });
    }

    setIsEtcActive(false);
  };

  const handleFolderActivate = (folderName) => {
    navigate(`/d/cookbook/${folderName}`);
  };

  const handleFolderEtc = (e) => {
    e.stopPropagation();

    setIsEtcActive(!isEtcActive);
  };

  let timeoutId;
  const handleMouseEnter = () => {
    timeoutId = setTimeout(() => {
      setisMouseHoveringTitle(true);
    }, 500); // 1000 milliseconds = 1 second
  };

  const handleMouseLeave = () => {
    clearTimeout(timeoutId);
    setisMouseHoveringTitle(false);
  };

  return (
    <div
      className={"cookbook-user-folder"}
      onClick={() => handleFolderActivate(folderData.folderName)}
      ref={drop}
      style={{
        backgroundColor: isHovering ? "rgba(103, 180, 219, 0.4)" : "#e7ecef",
        transition: "background-color 0.2s ease",
      }}
    >
      <div className="cookbook-active-content">
        <CookbookIcon className="cookbook-icon" />

        <p
          className="cookbook-user-foldername"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {folderData.folderName}
        </p>
        {/* HOVER LABEL */}
        {isMouseHoveringTitle && (
          <p className="cookbook-user-complete-foldername">
            {folderData.folderName}
          </p>
        )}
        <h1 className="cookbook-user-items-count">{folderData.folderLength}</h1>

        <div className="cookbook-user-dots-content">
          <button
            className="cookbook-user-dots"
            onClick={(e) => handleFolderEtc(e)}
            onBlur={() => setIsEtcActive(false)}
          >
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
          </button>
          {isEtcActive && (
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
              <hr
                style={{
                  height: "1px",
                  background: "#C8C8C8",
                  width: "100%",
                  border: "none",
                }}
              />
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
        </div>
      </div>
    </div>
  );
}

export default FolderTemplate;
