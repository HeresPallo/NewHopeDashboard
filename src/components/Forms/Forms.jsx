// src/pages/Forms.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import axios from "axios";
import ShareFormModal from "./ShareFormModal";

const API_BASE_URL = "https://new-hope-e46616a5d911.herokuapp.com";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Forms = () => {
  const navigate = useNavigate();
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [currentFormToShare, setCurrentFormToShare] = useState("");

  // Submission counts state
  const [confirmationCount, setConfirmationCount] = useState(0);
  const [newApplicantCount, setNewApplicantCount] = useState(0);
  const [rrfCount, setRrfCount] = useState(0);

  // Function to fetch submission counts from the three tables
  const fetchSubmissionCounts = async () => {
    try {
      const [confirmationRes, newApplicantRes, rrfRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/confirmation_journal_submissions`),
        axios.get(`${API_BASE_URL}/new_applicant_journal_submissions`),
        axios.get(`${API_BASE_URL}/registration_rejection_form_submissions`)
      ]);
      setConfirmationCount(Array.isArray(confirmationRes.data) ? confirmationRes.data.length : 0);
      setNewApplicantCount(Array.isArray(newApplicantRes.data) ? newApplicantRes.data.length : 0);
      setRrfCount(Array.isArray(rrfRes.data) ? rrfRes.data.length : 0);
    } catch (error) {
      console.error("Error fetching submission counts:", error);
    }
  };

  useEffect(() => {
    fetchSubmissionCounts();
    // Optionally, you could refresh counts periodically.
  }, []);

  // Prepare data for the bar chart using real counts.
  const formSubmissions = [
    { form: "Confirmation Journal", count: confirmationCount },
    { form: "New Applicant Journal", count: newApplicantCount },
    { form: "Registration Rejection Form (RRF)", count: rrfCount },
  ];

  const chartData = {
    labels: formSubmissions.map((item) => item.form),
    datasets: [
      {
        label: "Submissions",
        data: formSubmissions.map((item) => item.count),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  // Share handler: posts share request (with share password and selected mobile users) to your backend.
  const handleShareForm = (formName, sharePassword, selectedUserIds) => {
    axios
      .post(`${API_BASE_URL}/shareForm`, { formName, sharePassword, userIds: selectedUserIds })
      .then((response) => {
        alert(`"${formName}" form successfully shared.`);
      })
      .catch((error) => {
        console.error("Error sharing form:", error);
        alert("Error sharing form.");
      });
  };

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
              title: { display: true, text: "Form Submissions" },
            },
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
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Confirmation Journal</h2>
          <p className="text-gray-600">Click here to fill the Confirmation Journal form.</p>
          <p className="text-sm text-gray-500 mt-2">Submissions: {confirmationCount}</p>
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
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">New Applicant Journal</h2>
          <p className="text-gray-600">Click here to fill the New Applicant Journal form.</p>
          <p className="text-sm text-gray-500 mt-2">Submissions: {newApplicantCount}</p>
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
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Registration Rejection Form (RRF)</h2>
          <p className="text-gray-600">Click here to fill the RRF form.</p>
          <p className="text-sm text-gray-500 mt-2">Submissions: {rrfCount}</p>
        </div>
      </div>
      
      {shareModalOpen && (
        <ShareFormModal
          formName={currentFormToShare}
          onClose={() => setShareModalOpen(false)}
          onShare={handleShareForm}
        />
      )}
    </div>
  );
};

export default Forms;
