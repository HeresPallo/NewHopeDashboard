// src/pages/Forms.jsx
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

  // Submission counts state
  const [confirmationCount, setConfirmationCount] = useState(0);
  const [newApplicantCount, setNewApplicantCount] = useState(0);
  const [rrfCount, setRrfCount] = useState(0);

  // Shared‑forms table state
  const [sharedList, setSharedList] = useState([]);

  // Fetch submission counts
  const fetchSubmissionCounts = async () => {
    try {
      const [cRes, nRes, rRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/confirmation_journal_submissions`),
        axios.get(`${API_BASE_URL}/new_applicant_journal_submissions`),
        axios.get(`${API_BASE_URL}/registration_rejection_form_submissions`)
      ]);
      setConfirmationCount(Array.isArray(cRes.data) ? cRes.data.length : 0);
      setNewApplicantCount(Array.isArray(nRes.data) ? nRes.data.length : 0);
      setRrfCount(Array.isArray(rRes.data) ? rRes.data.length : 0);
    } catch (err) {
      console.error("Error fetching submission counts:", err);
    }
  };

  // Fetch shared‑forms list
  const fetchSharedList = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/shareForm`);
      setSharedList(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching shared forms:", err);
    }
  };

  useEffect(() => {
    fetchSubmissionCounts();
    fetchSharedList();
  }, []);

  // Chart data
  const formSubmissions = [
    { form: "Confirmation Journal", count: confirmationCount },
    { form: "New Applicant Journal", count: newApplicantCount },
    { form: "Registration Rejection Form (RRF)", count: rrfCount },
  ];
  const chartData = {
    labels: formSubmissions.map(i => i.form),
    datasets: [{
      label: "Submissions",
      data: formSubmissions.map(i => i.count),
      backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"]
    }]
  };

  // Share handler
  const handleShareForm = (formName, sharePassword, selectedUserIds) => {
    axios.post(`${API_BASE_URL}/shareForm`, {
      formName, sharePassword, userIds: selectedUserIds
    })
    .then(() => {
      alert(`"${formName}" form successfully shared.`);
      fetchSharedList();
    })
    .catch(e => {
      console.error("Error sharing form:", e);
      alert("Error sharing form.");
    });
  };

  // Delete a share-password entry
  const handleDeleteShare = (id) => {
    if (!window.confirm("Revoke this share‑password?")) return;
    axios.delete(`${API_BASE_URL}/shareForm/${id}`)
      .then(() => fetchSharedList())
      .catch(e => {
        console.error("Error deleting share:", e);
        alert("Failed to revoke share.");
      });
  };

  const openShareModal = (formName, e) => {
    e.stopPropagation();
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mb-12">
        {[
          { name: "Confirmation Journal", count: confirmationCount, path: "/forms/confirmation" },
          { name: "New Applicant Journal", count: newApplicantCount, path: "/forms/newapplicant" },
          { name: "Registration Rejection Form (RRF)", count: rrfCount, path: "/forms/rrf" }
        ].map(({ name, count, path }) => (
          <div
            key={name}
            className="relative p-6 bg-gray-50 rounded-xl shadow hover:shadow-lg transition cursor-pointer border"
            onClick={() => navigate(path)}
          >
            <div className="absolute top-2 right-2">
              <button
                className="px-2 py-1 bg-green-500 text-white text-xs rounded"
                onClick={(e) => openShareModal(name, e)}
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

      {/* SharePassword Modal */}
      {shareModalOpen && (
        <ShareFormModal
          formName={currentFormToShare}
          onClose={() => setShareModalOpen(false)}
          onShare={handleShareForm}
        />
      )}

      {/* Table of Active Share‑Passwords */}
      <div className="w-full max-w-5xl bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Active Shared Forms</h2>
        {sharedList.length === 0 ? (
          <p className="text-gray-500">No forms currently shared.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Form</th>
                <th className="p-2 border">Password</th>
                <th className="p-2 border">Shared To (User IDs)</th>
                <th className="p-2 border">Shared At</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sharedList.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="p-2 border">{item.form_name}</td>
                  <td className="p-2 border font-mono">{item.share_password}</td>
                  <td className="p-2 border">{(item.user_ids || []).join(", ")}</td>
                  <td className="p-2 border">{new Date(item.shared_at).toLocaleString()}</td>
                  <td className="p-2 border">
                    <button
                      className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                      onClick={() => handleDeleteShare(item.id)}
                    >
                      Revoke
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Forms;
