// src/pages/NewApplicantJournalForm.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

const API_BASE_URL = "https://new-hope-8796c77630ff.herokuapp.com";

const NewApplicantJournalForm = () => {
  // Form state for new applicant journal
  const [formData, setFormData] = useState({
    district: "",
    centreName: "",
    centreCode: "",
    entries: [
      { name: "", confirmationNumber: "", viuReceiptNumber: "", telephone: "", date: "" },
    ],
  });

  // State for submission entries
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(true);

  // Fetch submissions from the backend GET endpoint
  const fetchSubmissions = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/new_applicant_journal_submissions`);
      setSubmissions(response.data);
    } catch (error) {
      console.error("Error fetching new applicant journal submissions:", error);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  // Fetch submissions on component mount
  useEffect(() => {
    fetchSubmissions();
  }, []);

  // Handle input changes for dynamic entries
  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const updatedEntries = [...formData.entries];
    updatedEntries[index][name] = value;
    setFormData({ ...formData, entries: updatedEntries });
  };

  // Add a new row entry
  const addRow = () => {
    setFormData({
      ...formData,
      entries: [
        ...formData.entries,
        { name: "", confirmationNumber: "", viuReceiptNumber: "", telephone: "", date: "" },
      ],
    });
  };

  // Submit form data to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_BASE_URL}/new_applicant_journal_submissions`,
        formData,
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("New Applicant Journal submitted successfully:", response.data);
      alert("Form submitted successfully.");
      // Refresh the list of submissions after successful submission
      fetchSubmissions();
    } catch (error) {
      console.error("Error submitting new applicant journal:", error);
      alert("Error submitting form.");
    }
  };

  // Export submissions to Excel
  const exportToExcel = () => {
    if (!submissions || submissions.length === 0) {
      alert("No submissions available to export.");
      return;
    }
    // Prepare data for export; each submission becomes one row
    // The entries field is expected to be stored as JSON; we can stringify it for export display.
    const exportData = submissions.map(submission => ({
      district: submission.district,
      centreName: submission.centre_name,
      centreCode: submission.centre_code,
      entries: Array.isArray(submission.entries)
        ? submission.entries.map((entry, i) =>
            `Entry ${i + 1}: ${entry.name} / ${entry.confirmationNumber} / ${entry.viuReceiptNumber} / ${entry.telephone} / ${entry.date}`
          ).join(" | ")
        : JSON.stringify(submission.entries),
      submittedAt: new Date(submission.submitted_at).toLocaleString(),
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    // Use a short sheet name (31 chars max)
    XLSX.utils.book_append_sheet(wb, ws, "NAJ Submissions");
    XLSX.writeFile(wb, "NewApplicantJournal_Submissions.xlsx");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-4">New Applicant Journal</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-3xl bg-gray-50 p-6 rounded-xl shadow-md">
        <div className="flex gap-4 mb-4">
          <div className="w-1/3">
            <label className="block mb-1 font-semibold">District</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={formData.district}
              onChange={(e) => setFormData({ ...formData, district: e.target.value })}
            />
          </div>
          <div className="w-1/3">
            <label className="block mb-1 font-semibold">Centre Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={formData.centreName}
              onChange={(e) => setFormData({ ...formData, centreName: e.target.value })}
            />
          </div>
          <div className="w-1/3">
            <label className="block mb-1 font-semibold">Centre Code</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={formData.centreCode}
              onChange={(e) => setFormData({ ...formData, centreCode: e.target.value })}
            />
          </div>
        </div>

        <table className="w-full text-left border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">#</th>
              <th className="p-2 border">Name (First, Middle, Last)</th>
              <th className="p-2 border">Confirmation Number</th>
              <th className="p-2 border">VIU Receipt Number</th>
              <th className="p-2 border">Telephone</th>
              <th className="p-2 border">Date of Confirmation</th>
            </tr>
          </thead>
          <tbody>
            {formData.entries.map((entry, index) => (
              <tr key={index}>
                <td className="p-2 border">{index + 1}</td>
                <td className="p-2 border">
                  <input
                    type="text"
                    name="name"
                    className="w-full p-1 border rounded"
                    value={entry.name}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </td>
                <td className="p-2 border">
                  <input
                    type="text"
                    name="confirmationNumber"
                    className="w-full p-1 border rounded"
                    value={entry.confirmationNumber}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </td>
                <td className="p-2 border">
                  <input
                    type="text"
                    name="viuReceiptNumber"
                    className="w-full p-1 border rounded"
                    value={entry.viuReceiptNumber}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </td>
                <td className="p-2 border">
                  <input
                    type="text"
                    name="telephone"
                    className="w-full p-1 border rounded"
                    value={entry.telephone}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </td>
                <td className="p-2 border">
                  <input
                    type="date"
                    name="date"
                    className="w-full p-1 border rounded"
                    value={entry.date}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex gap-4">
          <button
            type="button"
            onClick={addRow}
            className="px-4 py-2 bg-blue-600 text-white rounded shadow"
          >
            Add Row
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded shadow"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={exportToExcel}
            className="px-4 py-2 bg-purple-600 text-white rounded shadow"
          >
            Export Excel
          </button>
        </div>
      </form>

      {/* Submissions Table */}
      <div className="w-full max-w-3xl mt-10">
        <h2 className="text-2xl font-semibold mb-4">Submitted Entries</h2>
        {loadingSubmissions ? (
          <p>Loading submissions...</p>
        ) : submissions.length === 0 ? (
          <p>No submissions yet.</p>
        ) : (
          <>
            <table className="w-full text-left border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">#</th>
                  <th className="p-2 border">District</th>
                  <th className="p-2 border">Centre Name</th>
                  <th className="p-2 border">Centre Code</th>
                  <th className="p-2 border">Entries</th>
                  <th className="p-2 border">Submitted At</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission, index) => (
                  <tr key={submission.id}>
                    <td className="p-2 border">{index + 1}</td>
                    <td className="p-2 border">{submission.district}</td>
                    <td className="p-2 border">{submission.centre_name}</td>
                    <td className="p-2 border">{submission.centre_code}</td>
                    <td className="p-2 border">
                      {Array.isArray(submission.entries)
                        ? submission.entries.map((entry, i) => (
                            <div key={i}>
                              {entry.name} / {entry.confirmationNumber} / {entry.viuReceiptNumber} / {entry.telephone} / {entry.date}
                            </div>
                          ))
                        : JSON.stringify(submission.entries)}
                    </td>
                    <td className="p-2 border">
                      {new Date(submission.submitted_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4">
              <button
                onClick={exportToExcel}
                className="px-4 py-2 bg-purple-600 text-white rounded shadow"
              >
                Export Excel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NewApplicantJournalForm;
