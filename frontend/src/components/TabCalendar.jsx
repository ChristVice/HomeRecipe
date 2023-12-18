import { React, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Nav from "./Nav";

function TabCalendar() {
  const [date, setDate] = useState(new Date());

  return (
    <div className="dashboard-page">
      {/* Right Side Content */}
      <Nav currentTab={3} />
      <div className="right-side-panel">
        <div className="top-gradient" />
        <div className="app">
          <h1 className="header">React Calendar</h1>
          <div className="calendar-container">
            <Calendar onChange={setDate} value={date} />
          </div>
          <div className="text-center">
            Selected date: {date.toDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TabCalendar;
