import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import axios from "axios";
import ShareFormModal from "./ShareFormModal";

const API_BASE_URL = "https://new-hope-e46616a5d911.herokuapp.com";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Forms = () => {
  const navigate = useNavigate();
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [currentFormToShare, setCurrentFormToShare] = useState("");

  // submission counts
  const [confirmationCount, setConfirmationCount] = useState(0);
  const [newApplicantCount, setNewApplicantCount] = useState(0);
  const [rrfCount, setRrfCount] = useState(0);

  // ** new state for active shared passwords **
  const [activeShares, setActiveShares] = useState([]);

  // fetch the three form‐submission counts
  const fetchSubmissionCounts = async () => {
    try {
      const [cRes, naRes, rrfRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/confirmation_journal_submissions`),
        axios.get(`${API_BASE_URL}/new_applicant_journal_submissions`),
        axios.get(`${API_BASE_URL}/registration_rejection_form_submissions`)
      ]);
      setConfirmationCount(Array.isArray(cRes.data) ? cRes.data.length : 0);
      setNewApplicantCount(Array.isArray(naRes.data) ? naRes.data.length : 0);
      setRrfCount(Array.isArray(rrfRes.data) ? rrfRes.data.length : 0);
    } catch (err) {
      console.error("Error fetching submission counts:", err);
    }
  };

  // fetch the table of shared passwords + who got them
  const fetchActiveShares = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/sharedForms`);
      setActiveShares(res.data);
    } catch (err) {
      console.error("Error fetching sharedForms:", err);
    }
  };

  useEffect(() => {
    fetchSubmissionCounts();
    fetchActiveShares();
  }, []);

  // bar‑chart data
  const formSubmissions = [
    { form: "Confirmation Journal", count: confirmationCount },
    { form: "New Applicant Journal", count: newApplicantCount },
    { form: "Registration Rejection Form (RRF)", count: rrfCount },
  ];
  const chartData = {
    labels: formSubmissions.map(i => i.form),
    datasets: [{
      label: "",
      data: formSubmissions.map(i => i.count),
      backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"]
    }]
  };

  // share handler (unchanged)
  const handleShareForm = (formName, sharePassword, selectedUserIds) => {
    axios.post(`${API_BASE_URL}/shareForm`, {
      formName,
      sharePassword,
      userIds: selectedUserIds
    })
    .then(() => {
      alert(`"${formName}" form successfully shared.`);
      fetchActiveShares();             // refresh table
    })
    .catch(err => {
      console.error("Error sharing form:", err);
      alert("Error sharing form.");
    });
  };

  // delete a shared‐password entry
  const handleDeleteShare = async (id) => {
    if (!window.confirm("Delete this share password?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/shareForm/${id}`);
      setActiveShares(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error("Error deleting shared password:", err);
      alert("Failed to delete.");
    }
  };

  const openShareModal = (formName, e) => {
    e.stopPropagation();
    setCurrentFormToShare(formName);
    setShareModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Forms Dashboard</h1>
      
      {/* Graph */}
      <div className="w-full max-w-4xl mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Form Submissions Overview
        </h2>
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

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {[
          ["Confirmation Journal", confirmationCount, "/forms/confirmation"],
          ["New Applicant Journal", newApplicantCount, "/forms/newapplicant"],
          ["Registration Rejection Form (RRF)", rrfCount, "/forms/rrf"]
        ].map(([name, count, path]) => (
          <div
            key={name}
            className="relative p-6 bg-gray-50 rounded-xl shadow hover:shadow-lg transition cursor-pointer border"
            onClick={() => navigate(path)}
          >
            <div className="absolute top-2 right-2">
              <button
                className="px-2 py-1 bg-green-500 text-white text-xs rounded"
                onClick={e => openShareModal(name, e)}
              >
                Share
              </button>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{name}</h2>
            <p className="text-gray-600">Click here to fill the {name} form.</p>
            <p className="text-sm text-gray-500 mt-2">Submissions: {count}</p>
          </div>
        ))}
      </div>

      {shareModalOpen && (
        <ShareFormModal
          formName={currentFormToShare}
          onClose={() => setShareModalOpen(false)}
          onShare={handleShareForm}
        />
      )}

      {/* ——————————————————————————————————————
           NEW: Active Shared Passwords Table
         —————————————————————————————————————— */}
      <div className="mt-12 w-full max-w-5xl">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Active Shared Forms & Passwords
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-3 text-left">Form</th>
                <th className="p-3 text-left">Password</th>
                <th className="p-3 text-left">Shared At</th>
                <th className="p-3 text-left">Users</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {activeShares.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-3 text-center text-gray-500">
                    No active shared passwords.
                  </td>
                </tr>
              ) : (
                activeShares.map(sf => (
                  <tr key={sf.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{sf.form_name}</td>
                    <td className="p-3 font-mono">{sf.share_password}</td>
                    <td className="p-3">
                      {new Date(sf.shared_at).toLocaleString()}
                    </td>
                    <td className="p-3">
                      {sf.users.map(u => u.name).join(", ")}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleDeleteShare(sf.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Forms;
