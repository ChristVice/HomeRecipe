import React from "react";
import "../styling/TabCalendarHeader.css";
import { ReactComponent as EmptyCalendarSVG } from "../images/dashboard/empty-calendar.svg";

function TabCalendarHeader({ isCalendarEmpty }) {
  return (
    <>
      {isCalendarEmpty ? (
        <section className="emptycalendar">
          <h1 className="tabcalendar-start-title">
            Embark on your culinary adventure by clicking on any day on the
            calendar!
          </h1>
          <EmptyCalendarSVG className="tabcalendar-empty-calendar-svg" />
          <h1 className="tabcalendar-start-subtitle">
            Effortlessly organize and select recipes, and your upcoming culinary
            delights will show right here.
          </h1>
        </section>
      ) : (
        <div>
          <h1>Not empty! Display your actual content here.</h1>
        </div>
      )}
    </>
  );
}

export default TabCalendarHeader;
