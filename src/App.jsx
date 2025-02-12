import React from 'react';
import AllRouting from "./components/AllRouting";
import Sidebar from "./components/Admin/Sidebar";
import { useState, useEffect } from "react";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
    };
    console.log('Component mounted');
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar: Only show when authenticated */}
      {isAuthenticated && <Sidebar />}
      
      {/* Main Content */}
      <div className={`flex-1 p-6 overflow-auto ${isAuthenticated ? 'ml-64' : ''}`}>
        <AllRouting />
      </div>
    </div>
  );
};

export default App;