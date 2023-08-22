import { useState } from "react";
import styles from "./Navbar.module.css";
import { Link } from "react-router-dom";
import codeopLogo from "../assets/codeop-logo.jpeg";

function Navbar() {
  // token
  const token = localStorage.getItem("token");
  // adding the states
  const [isActive, setIsActive] = useState(false);

  //add the active class
  const toggleActiveClass = () => {
    setIsActive(!isActive);
  };

  //clean up function to remove the active class
  const removeActive = () => {
    setIsActive(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <nav className={`${styles.navbar}`}>
          {/* logo and link container */}
          <div className={`${styles.logoLinkContainer}`}>
            {/* logo */}
            <figure className="image is-64x64">
              <img className="is-rounded" src={codeopLogo} alt="codeop logo" />
            </figure>

            {/* link */}
            <Link to="/" className={`${styles.navLink}`}>
              CodeOp Mentor Matcher
            </Link>
          </div>

          <ul className={`${styles.navMenu} ${isActive ? styles.active : ""}`}>
            <li onClick={removeActive}>
              {token ? (
                <Link to="/matches">Admin</Link>
              ) : (
                <Link to="/admin">Log in </Link>
              )}
            </li>
            <li onClick={removeActive}>
              <Link to="/mentee" className={`${styles.navLink}`}>
                Mentee
              </Link>
            </li>
            <li onClick={removeActive}>
              <Link to="/mentor" className={`${styles.navLink}`}>
                Mentor
              </Link>
            </li>
          </ul>

          <div
            className={`${styles.hamburger} ${isActive ? styles.active : ""}`}
            onClick={toggleActiveClass}
          >
            <span className={`${styles.bar}`}></span>
            <span className={`${styles.bar}`}></span>
            <span className={`${styles.bar}`}></span>
          </div>
        </nav>
      </header>
    </div>
  );
}

export default Navbar;
