import React from "react";
import "../styles/Sidebar.css";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="logo">
        <img src="/icons8-heart-100.png" alt="Logo" />
      </div>
      <ul>
        <li>
          <Link to="/" className="Link">
            <i className="fas fa-home" style={{ marginRight: '25px' }}></i>Home
          </Link>
        </li>
        <li>
        <Link to="/Calendar" className="Link">
        <i className="fa-regular fa-calendar-days" style={{ marginRight: '25px' }}></i>Calendar
        </Link>
        </li>
        <li>
        <i className="fa-solid fa-chart-line" style={{ marginRight: '25px' }}></i>Graph
        </li>
        {/* Add more links as needed */}
      </ul>
    </div>
  );
};

export default Sidebar;
