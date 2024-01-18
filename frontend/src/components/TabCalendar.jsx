import { React, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function TabCalendar() {
  const [date, setDate] = useState(new Date());

  return (
    <div className="right-side-panel">
      <div className="app">
        <h1 className="header">React Calendar</h1>
        <div className="calendar-container">
          <Calendar onChange={setDate} value={date} />
        </div>
        <div className="text-center">Selected date: {date.toDateString()}</div>
      </div>
    </div>
  );
}

export default TabCalendar;
