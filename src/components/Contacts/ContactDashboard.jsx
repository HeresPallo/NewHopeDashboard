import React from 'react';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const ContactsDashboard = () => {
  const navigate = useNavigate();
  const [surveys, setSurveys] = useState([]);
  const [skills, setSkills] = useState([]); // Skills fetched from the database

  useEffect(() => {
    const token = localStorage.getItem("token"); // Adjust if you're storing it differently
  
    if (!token) {
      console.warn("⚠️ No token found in localStorage");
      return;
    }
  
    axios.get("https://new-hope-8796c77630ff.herokuapp.com/surveys", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => setSurveys(response.data))
      .catch(error => console.error("❌ Error fetching surveys:", error.response?.data || error));
  
    axios.get("https://new-hope-8796c77630ff.herokuapp.com/skills-directory")
      .then(response => setSkills(response.data))
      .catch(error => console.error("❌ Error fetching skills:", error));
  }, []);
  

  return (
    <div className="flex flex-col p-8 bg-white min-h-screen">
      {/* Dashboard Header */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-xl font-semibold text-gray-800">Contacts Dashboard</h2>
        <button
          onClick={() => navigate("/createsurvey")}
          className="px-5 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition"
        >
          + Create Survey
        </button>
      </div>

      {/* Surveys Section */}
      <h3 className="text-lg font-semibold text-gray-700 mt-4 mb-2">Surveys</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {surveys.length === 0 ? (
          <p className="text-gray-500 text-center">No surveys available.</p>
        ) : (
          surveys.map((survey) => (
            <div key={survey.id} className="bg-gray-100 p-4 shadow-sm border rounded-lg">
              <h4 className="text-md font-semibold">{survey.title}</h4>
              <p className="text-sm text-gray-600">{survey.description || "No description"}</p>
              <p className="text-xs text-gray-500 mt-2">
                Created: {new Date(survey.created_at).toLocaleDateString()}
              </p>
              <p className="text-xs text-gray-500">
                Respondents: {survey.respondent_count || 0}
              </p>
              <button
                onClick={() => navigate(`/viewsurvey/${survey.id}`)}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                View Responses
              </button>
            </div>
          ))
        )}
      </div>

      {/* Messages Section */}
      <div className="bg-white shadow-sm border rounded-lg p-4 flex justify-between items-center mt-8">
        <h3 className="text-lg font-semibold text-gray-700">User Messages</h3>
        <button
          onClick={() => navigate("/messages")}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          View Messages
        </button>
      </div>

      {/* Skills Directory Section */}
      <div className="bg-white p-4 shadow-sm border rounded-lg mt-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Skills Directory</h3>
        <p className="text-gray-500 text-center mb-4">Click the button below to view the full skills directory and export it to Excel.</p>
        <button
          onClick={() => navigate("/skills-directory")}
          className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition"
        >
          View Skills Directory
        </button>
      </div>
    </div>
  );
};

export default ContactsDashboard;
