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

const API_BASE_URL = "https://new-hope-8796c77630ff.herokuapp.com";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Forms() {
  const navigate = useNavigate();

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [currentFormToShare, setCurrentFormToShare] = useState("");

  const [confirmationCount, setConfirmationCount] = useState(0);
  const [newApplicantCount, setNewApplicantCount] = useState(0);
  const [rrfCount, setRrfCount] = useState(0);

  const [activeShares, setActiveShares] = useState([]);

  // NEW: custom templates
  const [templates, setTemplates] = useState([]);

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

  const fetchActiveShares = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/sharedForms`);
      setActiveShares(res.data);
    } catch (err) {
      console.error("Error fetching sharedForms:", err);
    }
  };

  const fetchTemplates = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/forms/templates`);
      setTemplates(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching templates:", err);
    }
  };

  useEffect(() => {
    fetchSubmissionCounts();
    fetchActiveShares();
    fetchTemplates();
  }, []);

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

  const handleShareForm = (formName, sharePassword, selectedUserIds) => {
    axios.post(`${API_BASE_URL}/shareForm`, {
      formName,
      sharePassword,
      userIds: selectedUserIds
    })
    .then(() => {
      alert(`"${formName}" form successfully shared.`);
      fetchActiveShares();
    })
    .catch(err => {
      console.error("Error sharing form:", err);
      alert("Error sharing form.");
    });
  };

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
      <div className="w-full max-w-6xl flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold text-gray-900">Forms Dashboard</h1>
        {/* NEW: Create Form */}
        <button
          onClick={() => navigate("/forms/create")}
          className="px-5 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition"
        >
          + Create Form
        </button>
      </div>

      {/* Graph */}
      <div className="w-full max-w-6xl mb-12">
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

      {/* Fixed forms cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
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

      {/* NEW: Custom forms/templates list */}
      <div className="mt-12 w-full max-w-6xl">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Custom Forms</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Fields</th>
                <th className="p-3 text-left">Created</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {templates.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-3 text-center text-gray-500">
                    No custom forms yet. Click “Create Form” to add one.
                  </td>
                </tr>
              ) : (
                templates.map(t => (
                  <tr key={t.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{t.name}</td>
                    <td className="p-3">{Array.isArray(t.fields) ? t.fields.length : 0}</td>
                    <td className="p-3">{new Date(t.created_at).toLocaleString()}</td>
                    <td className="p-3">
                      <button
                        onClick={() => navigate(`/forms/templates/${t.id}`)}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 mr-2"
                      >
                        View
                      </button>
                      {/* optional future: share dynamic forms via your existing /shareForm */}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {shareModalOpen && (
        <ShareFormModal
          formName={currentFormToShare}
          onClose={() => setShareModalOpen(false)}
          onShare={handleShareForm}
        />
      )}

      {/* Active shared forms/passwords table (unchanged) */}
      <div className="mt-12 w-full max-w-6xl">
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
                    <td className="p-3 font-mono">••••••</td>
                    <td className="p-3">{new Date(sf.shared_at).toLocaleString()}</td>
                    <td className="p-3">{sf.users.map(u => u.name).join(", ")}</td>
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
}
