import React from "react";
import styles from "../styles/TopNav.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { User } from "../models/user";

interface TopNavProp {
  loggedInUser: User | null,
}

const TopNav = ({loggedInUser}: TopNavProp) => {
    return (
        <div className={styles.container}>
          <h1 className={styles.title}>MOODY</h1>

          <div className={styles.userIcon}>
          {loggedInUser?.email && <span>{loggedInUser.email}</span>}
                <div className={styles.circle}>
                    <FontAwesomeIcon icon={faUser} className={styles.personIcon} />
                    
                </div>
            </div>
        </div>

        
      );
};

export default TopNav;