// src/pages/Forms.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import axios from "axios";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Modal component using a dropdown to select mobile users.
function ShareModalDropdown({ formName, onClose, onShare }) {
  const [mobileUsers, setMobileUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  useEffect(() => {
    // Fetch mobile users from your backend API at /mobileusers.
    axios.get("/mobileusers")
      .then(response => {
        const data = response.data;
        if (Array.isArray(data)) {
          setMobileUsers(data);
        } else if (data && Array.isArray(data.users)) {
          setMobileUsers(data.users);
        } else {
          console.error("API response is not in expected format:", data);
          setMobileUsers([]);
        }
      })
      .catch(error => {
        console.error("Error fetching mobile users", error);
      });
  }, []);
  

  const handleSelectionChange = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setSelectedUserIds(selected);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Share {formName}</h2>
        <select
          multiple
          className="w-full h-40 border p-2"
          value={selectedUserIds}
          onChange={handleSelectionChange}
        >
          {mobileUsers.map(user => (
            <option key={user.id} value={user.id}>
              {user.name} (ID: {user.id})
            </option>
          ))}
        </select>
        <div className="flex justify-end mt-4">
          <button className="px-4 py-2 bg-gray-300 rounded mr-2" onClick={onClose}>
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => {
              if (selectedUserIds.length === 0) {
                alert("Please select at least one user.");
                return;
              }
              onShare(formName, selectedUserIds);
              onClose();
            }}
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
}

const Forms = () => {
  const navigate = useNavigate();
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [currentFormToShare, setCurrentFormToShare] = useState("");

  // Dummy submission counts for graph display.
  const formSubmissions = [
    { form: "Confirmation Journal", count: 25 },
    { form: "New Applicant Journal", count: 15 },
    { form: "Registration Rejection Form (RRF)", count: 10 }
  ];

  // Prepare data for the bar chart.
  const chartData = {
    labels: formSubmissions.map(item => item.form),
    datasets: [
      {
        label: "Submissions",
        data: formSubmissions.map(item => item.count),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"]
      }
    ]
  };

  // Posts the share request to your backend.
  const handleShareForm = (formName, selectedUserIds) => {
    axios.post("/api/shareForm", { formName, userIds: selectedUserIds })
      .then(response => {
        alert(`"${formName}" form successfully shared.`);
      })
      .catch(error => {
        console.error("Error sharing form:", error);
        alert("Error sharing form.");
      });
  };

  // Opens the share modal for the specified form.
  const openShareModal = (formName, e) => {
    e.stopPropagation(); // Prevent card navigation.
    setCurrentFormToShare(formName);
    setShareModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Forms Dashboard</h1>
      
      {/* Graph Section */}
      <div className="w-full max-w-4xl mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Form Submissions Overview</h2>
        <Bar 
          data={chartData} 
          options={{
            responsive: true,
            plugins: {
              legend: { position: "top" },
              title: { display: true, text: "Form Submissions" }
            }
          }} 
        />
      </div>

      {/* Card Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {/* Card 1: Confirmation Journal */}
        <div
          className="relative p-6 bg-gray-50 rounded-xl shadow hover:shadow-lg transition cursor-pointer border"
          onClick={() => navigate("/forms/confirmation")}
        >
          <div className="absolute top-2 right-2">
            <button
              className="px-2 py-1 bg-green-500 text-white text-xs rounded"
              onClick={(e) => openShareModal("Confirmation Journal", e)}
            >
              Share
            </button>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Confirmation Journal
          </h2>
          <p className="text-gray-600">
            Click here to fill the Confirmation Journal form.
          </p>
        </div>
        
        {/* Card 2: New Applicant Journal */}
        <div
          className="relative p-6 bg-gray-50 rounded-xl shadow hover:shadow-lg transition cursor-pointer border"
          onClick={() => navigate("/forms/newapplicant")}
        >
          <div className="absolute top-2 right-2">
            <button
              className="px-2 py-1 bg-green-500 text-white text-xs rounded"
              onClick={(e) => openShareModal("New Applicant Journal", e)}
            >
              Share
            </button>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            New Applicant Journal
          </h2>
          <p className="text-gray-600">
            Click here to fill the New Applicant Journal form.
          </p>
        </div>
        
        {/* Card 3: Registration Rejection Form (RRF) */}
        <div
          className="relative p-6 bg-gray-50 rounded-xl shadow hover:shadow-lg transition cursor-pointer border"
          onClick={() => navigate("/forms/rrf")}
        >
          <div className="absolute top-2 right-2">
            <button
              className="px-2 py-1 bg-green-500 text-white text-xs rounded"
              onClick={(e) => openShareModal("Registration Rejection Form (RRF)", e)}
            >
              Share
            </button>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Registration Rejection Form (RRF)
          </h2>
          <p className="text-gray-600">
            Click here to fill the RRF form.
          </p>
        </div>
      </div>
      
      {shareModalOpen && (
        <ShareModalDropdown
          formName={currentFormToShare}
          onClose={() => setShareModalOpen(false)}
          onShare={handleShareForm}
        />
      )}
    </div>
  );
};

export default Forms;
