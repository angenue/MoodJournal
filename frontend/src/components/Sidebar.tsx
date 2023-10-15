import React from "react";
import styles from "../styles/Sidebar.module.css";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
  <div className={styles.logo}>
    <img src="/icons8-heart-100.png" alt="Logo" />
  </div>
  <ul>
    <li>
      <Link to="/" className={styles.Link}>
        <i className="fas fa-home" style={{ marginRight: '25px' }}></i>Home
      </Link>
    </li>
    <li>
      <Link to="/Calendar" className={styles.Link}>
        <i className="fa-regular fa-calendar-days" style={{ marginRight: '25px' }}></i>Calendar
      </Link>
    </li>
    <li>
      <i className="fa-solid fa-chart-line" style={{ marginRight: '25px' }}></i>Graph
    </li>
  </ul>
</div>

  );
};

export default Sidebar;
