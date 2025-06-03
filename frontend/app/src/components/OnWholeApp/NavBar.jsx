import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  UserMinusIcon,
  UserPlusIcon,
  DocumentArrowUpIcon,
  ChartBarSquareIcon,
  ServerStackIcon,
} from "@heroicons/react/24/solid";

const NavBar = () => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const { logout, user } = useAuth();

  const handleToggle = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-700 text-white">
      <div className="container mx-auto flex justify-between items-center p-2">
        {/* Logo */}
        <a className="text-xl font-bold flex items-center text-white" href="/">
          <span>FedClient</span>
        </a>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={handleToggle}
          aria-expanded={isNavbarOpen}
          aria-label="Toggle navigation"
        >
          {isNavbarOpen ? (
            <XMarkIcon className="w-7 h-7" />
          ) : (
            <Bars3Icon className="w-7 h-7" />
          )}
        </button>

        {/* Navigation Links */}
        <div
          className={`absolute md:static top-10 right-0 w-full md:w-auto bg-gray-900 md:bg-transparent md:flex md:items-center p-4 md:p-0 transition-all duration-300 ${
            isNavbarOpen ? "block" : "hidden"
          } md:ml-auto`}
        >
          <ul className="md:flex justify-end items-center space-y-4 md:space-y-0 md:space-x-6 w-full">
            <li>
              <NavLink
                className="flex items-center gap-2 py-2 px-4 hover:text-gray-400"
                to="/Request"
              >
                <DocumentArrowUpIcon className="w-5 h-5" /> New Training
              </NavLink>
            </li>
            <li>
              <NavLink
                className="flex items-center gap-2 py-2 px-4 hover:text-gray-400"
                to="/trainings"
              >
                <ChartBarSquareIcon className="w-5 h-5" /> Trainings
              </NavLink>
            </li>
            <li>
              <NavLink
                className="flex items-center gap-2 py-2 px-4 hover:text-gray-400"
                to="/ManageData"
              >
                <ServerStackIcon className="w-5 h-5" /> Manage Data
              </NavLink>
            </li>
            
            <li>
              <NavLink
                className="flex items-center gap-2 py-2 px-4 hover:text-gray-400"
                to="/"
              >
                <HomeIcon className="w-5 h-5" /> Dashboard
              </NavLink>
            </li>

            {!user && (
              <li>
                <NavLink
                  className="flex items-center gap-2 py-2 px-4 hover:text-gray-400"
                  to="/Login"
                >
                  <UserPlusIcon className="w-5 h-5" /> Login
                </NavLink>
              </li>
            )}
            {user && (
              <li>
                <button
                  className="flex items-center gap-2 py-2 px-4 hover:text-gray-400"
                  onClick={logout}
                >
                  <UserMinusIcon className="w-5 h-5" /> Log out
                </button>
              </li>
            )}

            {/* <li>
              <NavLink
                className="flex items-center gap-2 py-2 px-4 hover:text-gray-400"
                to="/About"
              >
                <InformationCircleIcon className="w-5 h-5" /> About
              </NavLink>
            </li> */}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
