import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const NavBar = () => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const { logout, user } = useAuth()

  const handleToggle = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };

  return (
    <nav
      className="navbar navbar-expand-lg bg-dark border-bottom border-body"
      data-bs-theme="dark"
    >
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          FedClient
        </a>
        <button
          className="navbar-toggler"
          type="button"
          onClick={handleToggle}
          aria-controls="navbarSupportedContent"
          aria-expanded={isNavbarOpen ? "true" : "false"}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className={`collapse navbar-collapse ${isNavbarOpen ? "show" : ""}`}
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item me-3">
              <NavLink className="nav-link visible" to="/">
                Home
              </NavLink>
            </li>
            {
              !user &&
              <li className="nav-item me-3">
                <NavLink className="nav-link visible" to="/Register">
                  Register
                </NavLink>
              </li>
            }
            <li className="nav-item me-3">
              <NavLink className="nav-link visible" to="/Datasets">
                Datasets
              </NavLink>
            </li>
            <li className="nav-item me-3">
              <NavLink className="nav-link visible" to="/Request">
                Request
              </NavLink>
            </li>
            <li className="nav-item me-3">
              <NavLink className="nav-link visible" to="/TrainingStatus">
                Training Status
              </NavLink>
            </li>
            <li className="nav-item me-3">
              <NavLink className="nav-link visible" to="/Results">
                Training Results
              </NavLink>
            </li>
            <li className="nav-item me-3">
              <NavLink className="nav-link visible" to="/About">
                About
              </NavLink>
            </li>
            {
              user &&
              <li className="nav-item me-3">
                <div className="nav-link visible" onClick={logout}>
                  Log out
                </div>
              </li>
            }
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
