import React, { useState } from "react";
import "../styling/TabCalendar.css";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import timeGridPlugin from "@fullcalendar/timegrid";
import TabCalendarHeader from "./TabCalendarHeader";

import { v4 as uuidv4 } from "uuid";

function TabCalendar() {
  const [events, setEvents] = useState([]);

  const [selectedRecipe, setSelectedRecipe] = useState("");
  const recipeTitles = [
    "Spaghetti Carbonara",
    "Chicken Tikka Masala",
    "Chocolate Cake",
  ];

  const handleRecipeChange = (event) => {
    setSelectedRecipe(event.target.value);
  };

  const EventTitleWithImage = ({ title, imageURL }) => (
    <div
      className="tabcalendar-event-title-container"
      // style={ clickedEvent.defId && clickedEvent.defId === id ? { position: "relative" } : {} }
    >
      <img src={imageURL} alt="recipe food" />
      <p>{title}</p>
    </div>
  );
  const generateUniqueId = () => {
    return uuidv4();
  };

  const handleDateClick = (arg) => {
    console.log(arg);

    const newEvent = {
      className: "recipe-event-div",
      title: "Roasted Apples", // Replace with your desired title
      start: arg.dateStr,
      allDay: true, // Adjust as needed
      editable: true,
      id: generateUniqueId(),
      imageURL:
        "https://edamam-product-images.s3.amazonaws.com/web-img/a8c/a8cbde5520315fa9d8d6adbfbd6ed33e-l.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAwaCXVzLWVhc3QtMSJGMEQCIEZ1SMJLGL2G5ibc9qhsO8lLCvQEh3nAaCfbG7d1Ora0AiA%2BdOUQ4bNFS4770sNB1djRezZGfeucqgTjdVBYRT3L4CrCBQjF%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMsK8EOCehxhGEQ6VCKpYFOEPP4AsQ3fHP8k44fFnzBB8CvKHAwnGBPv3gdYJjCbl8S9jnaz4jAKY21r5IUVDzwCGzO1cTQA9dbgiPcfqOVx0W%2BybKvpme5mVFmS9pMzpGbADMnml%2BYD%2BtD%2BxuNSkY7ZvN2riOnhb6q%2Bk3sMmIX6RYYQrIso5KapZGwHc%2FKIJKEiDNecFdreCyA%2BYVSl%2FxBPFa2CwbhYHqEEgxR3jCv%2F6cF7IQC0c%2BXnZeTU8zLaIdI2XC7qfWEvD%2B43NvIHIpshOJfvjMuVCEOcM8DvdnmuIN9G5vYQSpNFaougOueOPed6d7tqWFXw%2B1rWkyojLfED73TxQdfiYs%2BLDCoBzn6ns1Oz%2BNSru7wIhxdsklzzsnZ13YrwPVtB8j7nyH4uNdfbzSXgVDLuACSHdxacUVMKPMxMMaw2s%2FZDk5uHcMhmvtzeFOF9ygpPtEuEzHCxP0NGRZfew90lZ05VyHcMpQ7UkoWRNViKutzUjhhYLBxB%2BI5BJCnTJF09iikcQ2fqFuyk9TVlhLXaVx6XJphJFtELDbq5GJEVzj7K3BQKDmBuXyXPNvdwu7PT4fgxezeDm%2BejDcmVa9Z7yYeYuTjzQUIbOPxzwIH1DkV1n8H6L3k416w6h7hsOY%2F3omreVh2OjBPWrrHk%2BSCqg0KvmAeFka5NIDzoNxbKI9HiaM%2FN9yYPtAvF%2FUNOSe7fX%2F5dUFjlPW0T88DLJmhJZ4axDz8etDOsIFMBuziLQZazwAMssC9DgzDdq0j%2FjklQa9SVRtvbsHo7ItpaeyDPJGBiCmg0gpVSn7%2B4vea8V7xiDQCb0u1agMdKmdTRbaY%2Bo74LA02Z0mRPYD7jc0QtqfYlUu71FoYNOW6Ml7AqkybaCsxPXjg5iTkjTVlGow9r7VrQY6sgF9fN%2FoLQnMZvbmAKzVyJzsXGchNswC6SvHnNmcq2vr5KV2gLGVH%2FQRA5Rj%2F1JH%2BHOsD2zLEtN3GVbBTxtkfEOMSwO8kYEpE3EM2e0tb%2BfIsQnJzHtcHFCptCGz2cv5ifv%2BJczLSwmITRg3LA1ZlOb88xnEl65Kj7cf2IGeZ53BFEKfFD6pCikh8Iae1rj5B%2FVkJfuuMJSea5CNLMFX0hY335jZySalKezzDQ3cysMvi5bJ&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240127T201545Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3599&X-Amz-Credential=ASIASXCYXIIFORESKDPB%2F20240127%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=4cb7d86c827c39005bae03212c260e3115094a93adfa6efdbac2360aa7192180",
    };

    setEvents([...events, newEvent]);
  };

  const handleEventClick = (info) => {
    console.log(info);
  };

  const handleEventDrop = (arg) => {
    // add code to update the date on the event that has been dropped in
    console.log({ "dropped :: ": arg });
  };

  return (
    <div className="right-side-panel">
      <TabCalendarHeader isCalendarEmpty={true} />
      <section className="calendar-app">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
          initialView="dayGridMonth"
          weekends={true}
          headerToolbar={{
            left: "prev,next",
            center: "title",
            right: "today", // user can switch between the two
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
            />
          )}
        />
      </section>
    </div>
  );
}

export default TabCalendar;
