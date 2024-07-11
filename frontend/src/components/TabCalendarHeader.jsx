import React, { useEffect, useState } from "react";
import "../styling/TabCalendarHeader.css";
import { ReactComponent as EmptyCalendarSVG } from "../images/dashboard/empty-calendar.svg";
import CalendarRecipeCard from "./CalendarRecipeCard";
import { handleGetRecipe } from "./BackendMethods";
import { motion } from "framer-motion";

function TabCalendarHeader({ calendarEvents }) {
  const [todayDate, setTodayDate] = useState("");
  const [todayMeals, setTodayMeals] = useState([]);
  const [upcomingMeals, setUpcomingMeals] = useState([]);

  const [recipes, setRecipes] = useState([]);

<<<<<<< HEAD
  /* GETS ALL RECIPES ASSOCIATED TO USER */
=======
  const [isLoading, setIsLoading] = useState(true);

>>>>>>> ed719d891e6e9e959fe96fd3488c96c02e33a5a5
  useEffect(() => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");

    const today = `${year}-${month}-${day}`;

    console.log("todayDate", today);
    setTodayDate(today);

    handleGetRecipe().then((data) => {
      setRecipes(data);
      setIsLoading(false);
    });
  }, []);

  /* GETS EVENTS AND RETURNS TODAYS AND UPCOMING */
  useEffect(() => {
    const findRecipes = (data) => {
      const sortedData = [...data].sort(
        (a, b) => new Date(a.start) - new Date(b.start)
      );

      const todayMeals = sortedData.filter((item) => {
        return item.start === todayDate;
      });

      const upcomingDates = sortedData.filter((item) => item.start > todayDate);
      const groupedDates = upcomingDates.reduce((acc, item) => {
        const date = item.start;
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(item);
        return acc;
      }, {});

      const dateArrays = Object.values(groupedDates);
      const firstMeals = dateArrays[0];
      const secondMeals = dateArrays[1];

      setTodayMeals(todayMeals);
      setUpcomingMeals([firstMeals, secondMeals]);
    };

    if (calendarEvents.length > 0) {
      findRecipes(calendarEvents);
    }
  }, [calendarEvents, todayDate]);

  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      month: "short",
    }).format(date);
    return formattedDate;
  };

  const likedRecipesMotionContainer = {
    hidden: { opacity: 1, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.2,
      },
    },
  };

  const likedRecipesMotionItem = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  const handleTest = () => {
    console.log("calendarEvent", calendarEvents);
    console.log("todayMeals", todayMeals);
    console.log("upcomingMeals", upcomingMeals);
    console.log("todayDate", todayDate);

    if (calendarEvents.length === 1) {
      console.log(calendarEvents[0].start > todayDate); //if event date is after today
      console.log(calendarEvents[0].start < todayDate); //if event date is before today
    }
  };

  /* When user clicks to make new event, ignore it until confirmed, also ignore if its before today*/
  return (
    <>
<<<<<<< HEAD
      {calendarEvents.length === 0 ||
      (calendarEvents.length === 1 &&
        calendarEvents[0].title === "(New event)") ||
      calendarEvents[0].start < todayDate ? (
=======
      {isLoading ? (
        <p className="isLoading">Loading...</p>
      ) : calendarEvents.length === 0 ? (
>>>>>>> ed719d891e6e9e959fe96fd3488c96c02e33a5a5
        <section className="emptycalendar">
          <h1 className="tabcalendar-start-title">
            Embark on your culinary adventure by clicking on any day on the
            calendar!
          </h1>
          <EmptyCalendarSVG className="tabcalendar-empty-calendar-svg" />
          <h1 className="tabcalendar-start-subtitle">
            Effortlessly organize and select recipes, and your upcoming culinary
            delights for today or the future will show right here.
          </h1>
        </section>
      ) : (
        <section>
          <h1 className="calendar-upcoming-title" onClick={handleTest}>
            Upcoming Dishes
          </h1>
          {todayMeals &&
            todayMeals.length === 0 &&
            recipes["recipes"] &&
            upcomingMeals[0] &&
            upcomingMeals[0].length > 0 && (
              <div className="calendar-upcoming-events-container">
                <div className="calendar-event-slide">
                  <div className="calendar-event-date">
                    <h1 className="calendar-upcoming-day">
                      {upcomingMeals[0][0].start.slice(-2)}
                    </h1>
                    <h1 className="calendar-upcoming-month">
                      {formatDate(upcomingMeals[0][0].start).toUpperCase()}
                    </h1>
                    <hr className="calendar-upcoming-hr" />
                  </div>

                  <div className="cards-container">
                    <div className="scrollable-wrapper">
                      <motion.div
                        variants={likedRecipesMotionContainer}
                        initial="hidden"
                        animate="visible"
                      >
                        <ul className="upcoming-meals-container">
                          {upcomingMeals[0].map((meal, index) => {
                            const recipeData = recipes["recipes"].find(
                              (item) => item.recipeID === meal.recipeID
                            );
                            return (
                              <motion.div
                                key={index}
                                variants={likedRecipesMotionItem}
                              >
                                <CalendarRecipeCard
                                  key={index}
                                  recipe={recipeData}
                                />
                              </motion.div>
                            );
                          })}
                        </ul>
                      </motion.div>
                    </div>
                  </div>
                </div>
                {upcomingMeals[1] && upcomingMeals[1].length > 0 && (
                  <div className="calendar-event-slide">
                    <div className="calendar-event-date">
                      <h1 className="calendar-upcoming-day">
                        {upcomingMeals[1][0].start.slice(-2)}
                      </h1>
                      <h1 className="calendar-upcoming-month">
                        {formatDate(upcomingMeals[1][0].start).toUpperCase()}
                      </h1>
                      <hr className="calendar-upcoming-hr" />
                    </div>

                    <div className="cards-container">
                      <div className="scrollable-wrapper">
                        <motion.div
                          variants={likedRecipesMotionContainer}
                          initial="hidden"
                          animate="visible"
                        >
                          <ul className="upcoming-meals-container">
                            {upcomingMeals[1].map((meal, index) => {
                              const recipeData = recipes["recipes"].find(
                                (item) => item.recipeID === meal.recipeID
                              );
                              return (
                                <motion.div
                                  key={index}
                                  variants={likedRecipesMotionItem}
                                >
                                  <CalendarRecipeCard
                                    key={index}
                                    recipe={recipeData}
                                  />
                                </motion.div>
                              );
                            })}
                          </ul>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          {todayMeals && todayMeals.length > 0 && recipes["recipes"] && (
            <div className="calendar-upcoming-events-container">
              <div className="calendar-event-slide">
                <div className="calendar-event-date">
                  <h1 className="calendar-today-subhead">TODAY</h1>
                  <h1 className="calendar-upcoming-day">
                    {todayDate.slice(-2)}
                  </h1>
                  <h1 className="calendar-upcoming-month">
                    {formatDate(todayDate).toUpperCase()}
                  </h1>
                  <hr className="calendar-upcoming-hr" />
                </div>

                <div className="cards-container">
                  <div className="scrollable-wrapper">
                    <motion.div
                      variants={likedRecipesMotionContainer}
                      initial="hidden"
                      animate="visible"
                    >
                      <ul className="upcoming-meals-container">
                        {todayMeals.map((meal, index) => {
                          const recipeData = recipes["recipes"].find(
                            (item) => item.recipeID === meal.recipeID
                          );
                          return (
                            <motion.div
                              key={index}
                              variants={likedRecipesMotionItem}
                            >
                              <CalendarRecipeCard
                                key={index}
                                recipe={recipeData}
                              />
                            </motion.div>
                          );
                        })}
                      </ul>
                    </motion.div>
                  </div>
                </div>
              </div>
              {upcomingMeals[0] && upcomingMeals[0].length > 0 && (
                <div className="calendar-event-slide">
                  <div className="calendar-event-date">
                    <h1 className="calendar-upcoming-day">
                      {upcomingMeals[0][0].start.slice(-2)}
                    </h1>
                    <h1 className="calendar-upcoming-month">
                      {formatDate(upcomingMeals[0][0].start).toUpperCase()}
                    </h1>
                    <hr className="calendar-upcoming-hr" />
                  </div>

                  <div className="cards-container">
                    <div className="scrollable-wrapper">
                      <motion.div
                        variants={likedRecipesMotionContainer}
                        initial="hidden"
                        animate="visible"
                      >
                        <ul className="upcoming-meals-container">
                          {upcomingMeals[0].map((meal, index) => {
                            const recipeData = recipes["recipes"].find(
                              (item) => item.recipeID === meal.recipeID
                            );
                            return (
                              <motion.div
                                key={index}
                                variants={likedRecipesMotionItem}
                              >
                                <CalendarRecipeCard
                                  key={index}
                                  recipe={recipeData}
                                />
                              </motion.div>
                            );
                          })}
                        </ul>
                      </motion.div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      )}
    </>
  );
}

export default TabCalendarHeader;
