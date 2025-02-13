import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const NavBar = () => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const { logout, user } = useAuth();

  const handleToggle = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-700 text-white">
      <div className="container mx-auto flex justify-between items-center p-4">
        <a className="text-xl font-bold" href="#">
          FedClient
        </a>
        <button
          className="block md:hidden text-white focus:outline-none"
          onClick={handleToggle}
          aria-expanded={isNavbarOpen}
          aria-label="Toggle navigation"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>
        <div
          className={`md:flex md:items-center ${
            isNavbarOpen ? "block" : "hidden"
          } w-full md:w-auto`}
        >
          <ul className="md:flex md:space-x-6 text-center md:text-left">
            <li>
              <NavLink className="block py-2 px-4 hover:text-gray-400" to="/">
                Home
              </NavLink>
            </li>
            {!user && (
              <li>
                <NavLink
                  className="block py-2 px-4 hover:text-gray-400"
                  to="/Register"
                >
                  Register
                </NavLink>
              </li>
            )}
            <li>
              <NavLink
                className="block py-2 px-4 hover:text-gray-400"
                to="/Datasets"
              >
                Datasets
              </NavLink>
            </li>
            <li>
              <NavLink
                className="block py-2 px-4 hover:text-gray-400"
                to="/Request"
              >
                Request
              </NavLink>
            </li>
            <li>
              <NavLink
                className="block py-2 px-4 hover:text-gray-400"
                to="/TrainingStatus"
              >
                Training Status
              </NavLink>
            </li>
            <li>
              <NavLink
                className="block py-2 px-4 hover:text-gray-400"
                to="/Results"
              >
                Training Results
              </NavLink>
            </li>
            <li>
              <NavLink
                className="block py-2 px-4 hover:text-gray-400"
                to="/ManageData"
              >
                Manage Data
              </NavLink>
            </li>
            <li>
              <NavLink
                className="block py-2 px-4 hover:text-gray-400"
                to="/About"
              >
                About
              </NavLink>
            </li>
            {user && (
              <li>
                <button
                  className="block py-2 px-4 hover:text-gray-400 w-full text-left"
                  onClick={logout}
                >
                  Log out
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
