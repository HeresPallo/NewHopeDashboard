import React from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import { MdHouse, MdPeopleAlt, MdAddCard, MdNewspaper, MdContactPhone, MdSettings, MdExitToApp } from "react-icons/md";

const Sidebar = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove authentication tokens from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");

    // Update authentication state in AllRouting
    setIsAuthenticated(false);

    // Redirect to login page
    navigate("/login");
  };

 
  return (
    <div>
      <aside id="logo-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
        <div className="h-full px-3 py-4 overflow-y-auto bg-white">
          <a href="http://localhost:5173/admin/overview" className="flex items-center ps-2.5 mb-5">
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-black">People</span>
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-red-500">First</span>
          </a>
          <ul className="space-y-2 font-medium group">
            <li>
              <div className="flex items-center p-2 text-gray-500 rounded-lg hover:text-white hover:bg-red-500 focus:bg-red-500 group-focus:bg-red-500">
                <MdHouse />
                <NavLink className="ms-3 text-black hover:text-white focus:text-black" to='/overview'>Overview</NavLink>
              </div>
            </li>
            <li>
              <div className="flex items-center p-2 text-gray-500 rounded-lg hover:text-white hover:bg-red-500 focus:bg-red-500 group-focus:bg-red-500">
                <MdPeopleAlt />
                <NavLink className="ms-3 text-black hover:text-white focus:text-black" to='/delegateorgans'>Delegates</NavLink>
              </div>
            </li>
            <li>
              <div className="flex items-center p-2 text-gray-500 rounded-lg hover:text-white hover:bg-red-500 focus:bg-red-500 group-focus:bg-red-500">
                <MdAddCard />
                <NavLink className="ms-3 text-black hover:text-white focus:text-black" to='/fundraiser'>Fundraiser</NavLink>
              </div>
            </li>
            <li>
              <div className="flex items-center p-2 text-gray-500 rounded-lg hover:text-white hover:bg-red-500 focus:bg-red-500 group-focus:bg-red-500">
                <MdNewspaper />
                <NavLink className="ms-3 text-black hover:text-white focus:text-black" to='/newsdashboard'>News</NavLink>
              </div>
            </li>
            <li>
              <div className="flex items-center p-2 text-gray-500 rounded-lg hover:text-white hover:bg-red-500 focus:bg-red-500 group-focus:bg-red-500">
                <MdContactPhone />
                <NavLink className="ms-3 text-black hover:text-white focus:text-black" to='/contactsdashboard'>Contacts</NavLink>
              </div>
            </li>
            <li>
              <div className="flex items-center p-2 text-gray-500 rounded-lg hover:text-white hover:bg-red-500 focus:bg-red-500 group-focus:bg-red-500">
                <MdSettings />
                <NavLink className="ms-3 text-black hover:text-white focus:text-black" to='/user-management'>Settings</NavLink>
              </div>
            </li>
            {/* Logout Button */}
            <li>
              <div
                className="flex items-center p-2 text-gray-500 rounded-lg hover:text-white hover:bg-red-600 focus:bg-red-600 cursor-pointer"
                onClick={handleLogout}
              >
                <MdExitToApp />
                <span className="ms-3 text-black hover:text-white focus:text-black">Logout</span>
              </div>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
