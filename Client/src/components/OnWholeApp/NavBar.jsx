import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useGlobalData } from "../../GlobalContext";

const NavBar = function NavBar() {
  const { GlobalData, setGlobalData } = useGlobalData();
  const clientName = GlobalData.Client.ClientID;
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  const handleNavLinkClick = () => {
    setIsNavbarOpen(false); // Close the offcanvas navbar when a NavLink is clicked
  };

  return (
    <nav className="navbar navbar-dark bg-dark fixed-top">
      <div className="container-fluid">
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsNavbarOpen(!isNavbarOpen)} // Toggle the navbar state
          aria-expanded={isNavbarOpen ? "true" : "false"}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <a className="navbar-brand" href="#">
          {clientName === "" ? "Unknown" : clientName}
        </a>
        <div
          className={`offcanvas offcanvas-start text-bg-dark ${
            isNavbarOpen ? "show" : ""
          }`}
          tabIndex="-1"
          id="offcanvasDarkNavbar"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title">Hello {clientName}</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={() => setIsNavbarOpen(false)} // Close the offcanvas navbar when close button is clicked
            ></button>
          </div>
          <div className="offcanvas-body">
            <ul className="navbar-nav justify-content-end flex-grow-1 pe-2">
              <li className="nav-item">
                <NavLink
                  className={"nav-link"}
                  to="/"
                  onClick={handleNavLinkClick}
                >
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className={"nav-link"}
                  to="/Register"
                  onClick={handleNavLinkClick}
                >
                  Register
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className={"nav-link"}
                  to="/Request"
                  onClick={handleNavLinkClick}
                >
                  Request
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className={"nav-link"}
                  to="/TrainingStatus"
                  onClick={handleNavLinkClick}
                >
                  TrainingStatus
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
