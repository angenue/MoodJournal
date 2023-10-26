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
        <i className="fas fa-home" style={{ marginRight: '25px' }}></i><span>Home</span>
      </Link>
    </li>
    <li>
      <Link to="/Calendar" className={styles.Link}>
        <i className="fa-regular fa-calendar-days" style={{ marginRight: '25px' }}></i><span>Calendar</span>
      </Link>
    </li>
    <li>
    <Link to="/Graph" className={styles.Link}>
      <i className="fa-solid fa-chart-line" style={{ marginRight: '25px' }}></i><span>Graph</span>
      </Link>
    </li>
<li>
<Link to="/SignUp">Sign Up</Link>
</li>
    
  </ul>
</div>

  );
};

export default Sidebar;
