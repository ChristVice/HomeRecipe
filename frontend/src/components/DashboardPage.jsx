import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styling/DashboardPage.css";
import Icon from "../images/webicon.png";

import TabHome from "./TabHome";
import TabCalendar from "./TabCalendar";
import TabCookbook from "./TabCookbook";

function DashboardPage() {
  const navigate = useNavigate();

  const [activeLink, setActive] = useState(1);

  const handleLogOut = () => {
    console.log("Logging out");
    localStorage.removeItem("token"); // Remove the token from localStorage
    console.log(localStorage.getItem("token"));
    navigate("/"); // Redirect to the home page
  };

  //const isAuthenticated = localStorage.getItem("token") !== null;
  const isAuthenticated = true; //temporary to work on dashboard page

  const handleActiveClick = (index, tabName) => {
    setActive(index);
    navigate(`/dashboard/${tabName}`); // Update URL to link/tabName
  };

  return (
    <div className="dashboard-page">
      <div className="left-side-panel">
        <div className="top-title">
          <svg
            className="menu-icon"
            width="26"
            height="26"
            viewBox="0 0 26 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="26" height="4" rx="2" fill="black" />
            <rect y="11" width="17.875" height="4" rx="2" fill="black" />
            <rect y="22" width="10.5625" height="4" rx="2" fill="black" />
          </svg>

          <div className="icon-text-main">
            <img className="web-icon" src={Icon} alt="Web Icon" />
            <p className="">HomeRecipe</p>
          </div>
        </div>

        <hr className="title-line" />

        {/* Tab Menu */}
        <ul className="side-tabs">
          <li
            className={activeLink === 1 ? "active" : ""}
            onClick={() => handleActiveClick(1, "home")}
          >
            <svg
              width="500"
              height="500"
              viewBox="0 0 500 500"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M174.835 469.552V392.881C174.835 373.452 191.465 357.667 212.064 357.545H287.7C308.391 357.545 325.165 373.365 325.165 392.881V469.33C325.164 486.181 339.58 499.876 357.446 499.999H409.048C433.148 500.057 456.283 491.069 473.347 475.017C490.41 458.965 500 437.168 500 414.437V196.646C500 178.284 491.37 160.868 476.437 149.087L301.131 16.8567C270.487 -6.27193 226.72 -5.52479 196.984 18.6346L25.4477 149.087C9.80896 160.52 0.461902 177.989 0 196.646V414.215C0 461.592 40.7206 499.999 90.9519 499.999H141.376C149.978 500.058 158.25 496.876 164.355 491.16C170.459 485.444 173.893 477.666 173.893 469.552H174.835Z"
                fill="black"
              />
            </svg>

            <p>Home</p>
          </li>
          <li
            className={activeLink === 2 ? "active" : ""}
            onClick={() => handleActiveClick(1, "meal-calendar")}
          >
            <svg
              width="500"
              height="500"
              viewBox="0 0 500 500"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M425 50H400V25C400 10 390 0 375 0C360 0 350 10 350 25V50H150V25C150 10 140 0 125 0C110 0 100 10 100 25V50H75C32.5 50 0 82.5 0 125V150H500V125C500 82.5 467.5 50 425 50ZM0 425C0 467.5 32.5 500 75 500H425C467.5 500 500 467.5 500 425V200H0V425ZM375 250C390 250 400 260 400 275C400 290 390 300 375 300C360 300 350 290 350 275C350 260 360 250 375 250ZM375 350C390 350 400 360 400 375C400 390 390 400 375 400C360 400 350 390 350 375C350 360 360 350 375 350ZM250 250C265 250 275 260 275 275C275 290 265 300 250 300C235 300 225 290 225 275C225 260 235 250 250 250ZM250 350C265 350 275 360 275 375C275 390 265 400 250 400C235 400 225 390 225 375C225 360 235 350 250 350ZM125 250C140 250 150 260 150 275C150 290 140 300 125 300C110 300 100 290 100 275C100 260 110 250 125 250ZM125 350C140 350 150 360 150 375C150 390 140 400 125 400C110 400 100 390 100 375C100 360 110 350 125 350Z"
                fill="black"
              />
            </svg>

            <p>Meal Calendar</p>
          </li>
          <li
            className={activeLink === 3 ? "active" : ""}
            onClick={() => handleActiveClick(1, "cookbook")}
          >
            <svg
              width="500"
              height="500"
              viewBox="0 0 500 500"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M84.0333 500H399.2C408.041 500 416.519 496.708 422.77 490.847C429.021 484.987 432.533 477.038 432.533 468.75V140.625C432.533 136.481 430.777 132.507 427.652 129.576C424.526 126.646 420.287 125 415.867 125H133.333C132.5 125 130.867 125.125 129.3 125.219L84.0333 125C56.0667 125 33.3333 104.969 33.3333 78.7812C33.3333 52.5625 55.3667 31.25 83.3333 31.25H466.667V390.625C466.667 399.25 473.333 406.25 482.567 406.25C491.8 406.25 500 399.25 500 390.625V15.625C500 7 491.767 0 482.567 0H84.0333C61.9736 0.00632787 40.8033 8.15422 25.1021 22.6811C9.40091 37.208 0.4312 56.9459 0.133333 77.625L0 77.4688V421.219C0.00441869 442.112 8.85932 462.147 24.6177 476.921C40.376 491.694 61.7477 499.996 84.0333 500Z"
                fill="black"
              />
            </svg>

            <p>Cookbooks</p>
          </li>
        </ul>
        {/* Logout Button */}
        <button className="logout-button" onClick={handleLogOut}>
          Logout
        </button>
      </div>

      {/* Right Side Content */}
      <div className="right-side-panel">
        <div className="top-gradient" />
        {activeLink === 1 ? (
          <TabHome isActive={true} />
        ) : activeLink === 2 ? (
          <TabCalendar isActive={true} />
        ) : (
          <TabCookbook isActive={true} />
        )}
      </div>
    </div>
  );

  /*
  if (isAuthenticated) {
    return (
      <div>
        <h1>Dashboard Landing Page</h1>
        <button onClick={handleLogOut}>Log out</button>

      </div>
    );
  } else {
    return <div>You are not authenticated</div>;

  }



  i want "/home" to show dashboard current page
  dashboard has left and right side content, side tabs with links to other tabs site url
  take dashboard 

  tabHome should have dashboard page code


  */
}

export default DashboardPage;
