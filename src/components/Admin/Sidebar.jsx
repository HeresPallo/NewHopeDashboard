import React from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import {
  MdHouse,
  MdPeopleAlt,
  MdAddCard,
  MdNewspaper,
  MdContactPhone,
  MdSettings,
  MdExitToApp,
  MdVolunteerActivism,   // volunteer icon
  MdLightbulb,            // vision icon
  MdForum                 // communication center icon
} from "react-icons/md";

const Sidebar = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <div>
      <aside
        id="logo-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-white">
          <a href="http://localhost:5173/admin/overview" className="flex items-center ps-2.5 mb-5">
            <span className="self-center text-xl font-semibold whitespace-nowrap text-black">People</span>
            <span className="self-center text-xl font-semibold whitespace-nowrap text-red-500">First</span>
          </a>

          <ul className="space-y-2 font-medium group">
            <li>
              <div className="flex items-center p-2 text-gray-500 rounded-lg hover:text-white hover:bg-red-500">
                <MdHouse />
                <NavLink className="ms-3 text-black hover:text-white" to='/overview'>Overview</NavLink>
              </div>
            </li>

            <li>
              <div className="flex items-center p-2 text-gray-500 rounded-lg hover:text-white hover:bg-red-500">
                <MdPeopleAlt />
                <NavLink className="ms-3 text-black hover:text-white" to='/delegateorgans'>Delegates</NavLink>
              </div>
            </li>

            <li>
              <div className="flex items-center p-2 text-gray-500 rounded-lg hover:text-white hover:bg-red-500">
                <MdAddCard />
                <NavLink className="ms-3 text-black hover:text-white" to='/datahub'>Data Hub</NavLink>
              </div>
            </li>

            <li>
              <div className="flex items-center p-2 text-gray-500 rounded-lg hover:text-white hover:bg-red-500">
                <MdNewspaper />
                <NavLink className="ms-3 text-black hover:text-white" to='/newsdashboard'>News</NavLink>
              </div>
            </li>

            {/* 💬 Communication Center */}
            <li>
              <div className="flex items-center p-2 text-gray-500 rounded-lg hover:text-white hover:bg-red-500">
                <MdForum />
                <NavLink className="ms-3 text-black hover:text-white" to='/contactsdashboard'>Communication Center</NavLink>
              </div>
            </li>

            {/* 🤝 Volunteer */}
            <li>
              <div className="flex items-center p-2 text-gray-500 rounded-lg hover:text-white hover:bg-red-500">
                <MdVolunteerActivism />
                <NavLink className="ms-3 text-black hover:text-white" to='/volunteer'>Volunteer</NavLink>
              </div>
            </li>

            {/* 💡 Vision */}
            <li>
              <div className="flex items-center p-2 text-gray-500 rounded-lg hover:text-white hover:bg-red-500">
                <MdLightbulb />
                <NavLink className="ms-3 text-black hover:text-white" to='/vision'>Vision</NavLink>
              </div>
            </li>

            <li>
              <div className="flex items-center p-2 text-gray-500 rounded-lg hover:text-white hover:bg-red-500">
                <MdAddCard />
                <NavLink className="ms-3 text-black hover:text-white" to='/forms'>Forms</NavLink>
              </div>
            </li>

            <li>
              <div className="flex items-center p-2 text-gray-500 rounded-lg hover:text-white hover:bg-red-500">
                <MdAddCard />
                <NavLink className="ms-3 text-black hover:text-white" to='/fundraiser'>Fundraiser</NavLink>
              </div>
            </li>

            <li>
              <div className="flex items-center p-2 text-gray-500 rounded-lg hover:text-white hover:bg-red-500">
                <MdSettings />
                <NavLink className="ms-3 text-black hover:text-white" to='/user-management'>Settings</NavLink>
              </div>
            </li>

            {/* 🚪 Logout */}
            <li>
              <div
                className="flex items-center p-2 text-gray-500 rounded-lg hover:text-white hover:bg-red-600 cursor-pointer"
                onClick={handleLogout}
              >
                <MdExitToApp />
                <span className="ms-3 text-black hover:text-white">Logout</span>
              </div>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
