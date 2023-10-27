import React, { useState, useEffect } from "react"
import styles from "../styles/Sidebar.module.css";
import { Link, useNavigate } from "react-router-dom";
import * as JournalsApi from "../utils/journal_api";
import { User } from "../models/user";
import 'react-toastify/dist/ReactToastify.css';
import { errorMessage, successMessage } from "../utils/toastMessage";

interface SidebarProps {
  onLogoutSuccessful: () => void,
}

const Sidebar = ({onLogoutSuccessful}: SidebarProps) => {
  const navigate = useNavigate();

  async function logout() {
    try {
      await JournalsApi.logout();
      onLogoutSuccessful();
      navigate('/login');
    } catch (error) {
      errorMessage("Logout Unsuccessful")
      console.error(error);
      alert(error);
    }
  }

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

    <li className={styles.logout}>
  <Link to="/login" className={styles.Link} onClick={logout}>
    <i className="fas fa-sign-out-alt" style={{ marginRight: '25px' }}></i><span>Logout</span>
  </Link>
</li>

    
  </ul>
</div>

  );
};

export default Sidebar;
