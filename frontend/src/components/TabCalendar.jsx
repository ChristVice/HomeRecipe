import React, { useState, useRef, useEffect } from "react";
import "../styling/TabCalendar.css";
import "../styling/EventPopup.css";
import "../styling/EventSearchOptions.css";
import TabCalendarHeader from "./TabCalendarHeader";
import { handleGetFavorites, handleGetFoldersBackend } from "./BackendMethods";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import timeGridPlugin from "@fullcalendar/timegrid";

import { v4 as uuidv4 } from "uuid";

function TabCalendar() {
  const [events, setEvents] = useState([]);
  const [clickedEvent, setClickedEvent] = useState({});
  const [isEventClicked, setIsEventClicked] = useState(false);

  const [selectedFolder, setSelectedFolder] = useState("Any");
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [folders, setFolders] = useState([]);
  const [isSearchOptionsVisible, setIsSearchOptionsVisible] = useState(false);

  const [inputText, setInputText] = useState("");

  const calendarRef = useRef(null);
  const [calendarKey, setCalendarKey] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await handleGetFoldersBackend("ALL");
        const favoriteData = await handleGetFavorites();
        setFolders(["Any", ...data.folders]);

        if (selectedFolder === "Any") {
          let options = [];

          data.folders.forEach((folder) => {
            const newRecipes = data.results[folder].filter((recipe) => {
              return !options.some(
                (optionRecipe) => optionRecipe.recipeID === recipe.recipeID
              );
            });

            options = [...options, ...newRecipes];
          });

          favoriteData["Favorites"].forEach((favorite) => {
            if (
              !options.some((recipe) => recipe.recipeID === favorite.recipeID)
            ) {
              options.push(favorite);
            }
          });

          setFilteredOptions(options);
        } else {
          setFilteredOptions(data.results[selectedFolder]);
        }
      } catch (error) {
        console.error("Error fetching user data for calendar:", error);
      }
    };

    fetchData();
  }, [selectedFolder]);

  // this method serves to update the calendar when an event is added or removed, thats it
  const handleUpdateEvents = () => {
    setCalendarKey(calendarKey + 1);
    setCalendarKey(calendarKey - 1);
    if (calendarKey >= 100 || calendarKey < 0) {
      setCalendarKey(1);
    }
  };

  const generateUniqueId = () => {
    return uuidv4();
  };

  const handleKeyPress = (event) => {
    if (event.key === "Escape") {
      handleCancel();
    }
    if (event.key === "Enter") {
      handleConfirm();
    }
  };

  const handleConfirm = () => {
    if (clickedEvent.title !== "(New event)" || inputText !== "") {
      const eventIndex = events.findIndex(
        (event) => event.id === clickedEvent.id
      );

      if (eventIndex !== -1) {
        const updatedEvents = [...events];
        if (inputText !== "") {
          updatedEvents[eventIndex].title = inputText;
          updatedEvents[eventIndex].imageURL = selectedOption.image_url;
          setEvents(updatedEvents);
        }
      }

      console.log(selectedFolder);
      setIsEventClicked(!isEventClicked);
      setInputText("");
      handleUpdateEvents();

      // after the event is updated, we want to change the view to the day of the event
      // otherwise it will send user back to the current day
      setTimeout(() => {
        calendarRef.current
          .getApi()
          .changeView("dayGridMonth", clickedEvent.start);
      }, 1);
    } else {
      handleCancel();
    }
  };

  const handleCancel = () => {
    console.log("cancel");
    setIsEventClicked(!isEventClicked);

    const eventIndex = events.findIndex(
      (event) => event.id === clickedEvent.id
    );

    if (eventIndex !== -1 && clickedEvent.title === "(New event)") {
      const updatedEvents = [...events];
      updatedEvents.splice(eventIndex, 1);

      setEvents(updatedEvents);
    }

    setIsEventClicked(!isEventClicked);
    setInputText("");
  };

  const handleDateClick = (arg) => {
    console.log(arg);

    const newEvent = {
      className: "recipe-event-div",
      title: "(New event)", // Replace with your desired title
      start: arg.dateStr,
      allDay: true, // Adjust as needed
      editable: true,
      id: generateUniqueId(),
      imageURL:
        "https://edamam-product-images.s3.amazonaws.com/web-img/35a/35a5d1ce9dec9e17c1d0e1bced566a1e.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEcaCXVzLWVhc3QtMSJHMEUCIQDpmyBPHd9%2BZUMdqKD20LBqNCv17OV7mZFa0v5Nh9mPBgIgX8eA5kUokfnjPjPlVt9huz6UJf%2BG1MnizAVNxPnPnEcquQUIIBAAGgwxODcwMTcxNTA5ODYiDAt2YWch0%2B5%2FyrWW4yqWBUgCpRfjDdzqM5iMB0j97pba0GjzflzEwz7jpb6Yj3Gp4%2Bfc8EKqSMb0FprpMQxuQ2c9Gpq7wWGeaSD9CyX%2Bir9CZfr2uuLovtW6rxTsvCWBDqPom9lwIE5WbtB6ubtjTyCnSQWMUE%2FTU3pLiPsAKixXOHln3R7907h8Grb8Jdj%2FXjuSUKoBhpwZKM2RPpG5cofmrjGjIxykLOd%2F3pEEFC7NYiC8BgdZPm24LobQxiu%2BAcSayu2BXwYVfp1C4uiBIiwxYLpr9z4zYS0U93p9yugPnxb9j8tZOTQTWq8R5FEM5UqNCYamGf4UmMsIbzByLCNvMeXyKAZe7DLkJ4YWtTYP7%2Bm5gTKSz3h3c%2Bjz2ivL1liODZPerFHTOwgWVNC8sQI90aEZx3mc5Qa9puxM7pezBFxbNYL%2FRPqGuqQzmSjoA1qianVc5euaDZ3ch8YlR6GW3B%2BQXHVfgQKN64r5v5tme%2FRXROp0N%2FEsJH%2BrJLYsrxGFlO%2B%2BS1zU4rTj10JvCWQGlFm2Zc2G%2BYCAhDBh1HPQPXspZI7M5AC2386g1BmH37JyWzgxoHk2AZQgzUGmxnqSQVuYHgvc%2B4egs%2BpogUuR9HK2NGqlETArCZXK4tN%2F3GsjM5er%2FQiNogKiawAsZslb3SsNVdRPa5ln2qkN7lV6Rrkg9WEpkX%2BpJF7UyP7mK3bjXmHvYhXzBjpzAxCY9Z3wkNStnKJrQuImHJ4g5o%2BixOPDWRHHvxj81efkyVzZH6EcuQhdwZgnHChOlU03mVOmEVW%2F9DfCp%2FRrhluW%2BUC6yBLhXzMmtUbIDDtFug4sKQOvNIqTVgggD4uZU5bIqBwIf%2BtGI5O0qkm0jprtmrfGf%2BYhNGpybmm5MDu67%2BlhPqnnfJpiMMDdmq4GOrEBm2X1A1mjUWPGDLsSOhIQwHAOJ87vU5mJVavx6qZ5pRVNg8dpoY1M4wFdICiRRvZpegSlKCWfs5a2xnTMrV1P%2FhIigMlsSVGElwPbEaZD08LSyQMf6yhC609qu23%2FnLX0fWA2fEc%2Banmkiv6dpuC3z5mT7xttPUARj7Umgm1dkg0KNS9q6hKicIoi4dRg%2BYuE2mENWRl1jUxyRNv16qlWubzygf9Q%2B9btJyaqPecS02sw&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240209T234816Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFJSP7VZZX%2F20240209%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=0c0aba4fd4d0742986c246f79652e3da4cb9080e48ed21435d42be5916398a7c",
    };

    setEvents([...events, newEvent]);
    setIsEventClicked(!isEventClicked);
    setClickedEvent(newEvent);
  };

  const handleEventClick = (info) => {
    console.log("event clicked :: ", info);
    const eventIndex = events.findIndex(
      (event) => event.id === info.event._def.publicId
    );

    setClickedEvent(events[eventIndex]);
    setIsEventClicked(!isEventClicked);

    if (events[eventIndex].title !== "(New event)") {
      setInputText(events[eventIndex].title);
    } else {
      setInputText("");
    }
  };

  const handleEventDrop = (arg) => {
    const eventID = arg.event._def.publicId;
    const eventDroppedDate = arg.event._instance.range.end;

    const eventIndex = events.findIndex((event) => event.id === eventID);

    if (eventIndex !== -1) {
      const updatedEvents = [...events];
      updatedEvents[eventIndex].start = eventDroppedDate;

      setEvents(updatedEvents);
    }
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSelectFolderChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedFolder(selectedValue);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setInputText(option.recipe_label);
    setIsSearchOptionsVisible(!isSearchOptionsVisible);

    console.log(option);
  };

  const handleSearchOptionsBlur = () => {
    setTimeout(() => {
      setIsSearchOptionsVisible(!isSearchOptionsVisible);
    }, 200);
  };

  const EventTitleWithImage = ({ title, imageURL, id }) => (
    <>
      <div
        className={`tabcalendar-event-title-container ${
          isEventClicked && id === clickedEvent.id ? "active" : ""
        }`}
        style={
          isEventClicked && id === clickedEvent.id
            ? {
                position: "relative",
                zIndex: 1000,
              }
            : {}
        }
      >
        <img
          src={imageURL}
          alt="recipe food"
          style={title === "(New event)" ? { width: "0px" } : {}}
        />

        <p>{title}</p>
      </div>
      <div
        className="active-event-blob-div"
        style={
          isEventClicked && id === clickedEvent.id
            ? {
                display: "block",
              }
            : {
                display: "none",
              }
        }
      ></div>
    </>
  );
  return (
    <div className="right-side-panel" style={{ position: "relative" }}>
      <TabCalendarHeader isCalendarEmpty={true} />

      <section className="calendar-app">
        <FullCalendar
          key={calendarKey}
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
          initialView="dayGridMonth"
          weekends={true}
          headerToolbar={{
            left: "prev,next",
            center: "title",
            right: "today",
          }}
          editable={true}
          dateClick={handleDateClick}
          eventDrop={handleEventDrop}
          eventClick={handleEventClick}
          events={events}
          eventContent={(event) => (
            <EventTitleWithImage
              title={event.event._def.title}
              imageURL={event.event._def.extendedProps.imageURL}
              id={event.event._def.publicId}
            />
          )}
        />
      </section>

      {isEventClicked && (
        <div
          className="event-popup-overlay"
          onClick={handleCancel}
          onKeyDown={handleKeyPress}
        >
          <div
            className="calendar-event-popup"
            onClick={(e) => e.stopPropagation()}
          >
            <h1 className="event-popup-title">Change the event’s recipe</h1>
            <div className="event-popup-labels">
              <select
                className="event-popup-choices"
                value={selectedFolder}
                onChange={handleSelectFolderChange}
              >
                {folders.map((folder, index) => (
                  <option key={index} value={folder}>
                    {folder}
                  </option>
                ))}
              </select>
              <div className="event-pop-up-search">
                <input
                  className="event-popup-input"
                  style={
                    isSearchOptionsVisible
                      ? { borderRadius: "0px 10px 0px 0px" }
                      : {}
                  }
                  type="text"
                  placeholder={"Search your recipes..."}
                  value={inputText}
                  onChange={handleInputChange}
                  onFocus={() =>
                    setIsSearchOptionsVisible(!isSearchOptionsVisible)
                  }
                  onBlur={() => handleSearchOptionsBlur()}
                  autoFocus
                />

                {isSearchOptionsVisible && filteredOptions.length > 0 && (
                  <div className="event-search-options">
                    <ul className="unordered-search-options-list">
                      {filteredOptions
                        .filter((option) =>
                          option.recipe_label
                            .toLowerCase()
                            .includes(inputText.toLowerCase())
                        )
                        .map((option, index) => (
                          <li
                            onClick={() => handleOptionClick(option)}
                            key={index}
                          >
                            {option.recipe_label}
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <div className="event-popup-bttns">
              <button className="cancel" onClick={handleCancel}>
                Cancel
              </button>
              <button
                className="confirm"
                onClick={() => handleConfirm(clickedEvent.id)}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TabCalendar;
