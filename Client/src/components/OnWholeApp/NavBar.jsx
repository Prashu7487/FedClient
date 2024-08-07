import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useGlobalData } from "../../GlobalContext";

const NavBar = function NavBar() {
  const { GlobalData, setGlobalData } = useGlobalData();
  // const clientName = GlobalData.Client.ClientName;
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  const handleNavLinkClick = () => {
    setIsNavbarOpen(false); // Close the offcanvas navbar when a NavLink is clicked
  };

  return (
    <nav
      className="navbar navbar-expand-lg"
      style={{ backgroundColor: "#e3f2fd" }}
    >
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          FedClient
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className={"nav-link"} to="/">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={"nav-link"} to="/Register">
                Register
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={"nav-link"} to="/Request">
                Request
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={"nav-link"} to="/TrainingStatus">
                TrainingStatus
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className={"nav-link"} to="/Results">
                TrainingResults
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
