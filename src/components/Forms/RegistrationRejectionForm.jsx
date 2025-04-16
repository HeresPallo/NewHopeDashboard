// src/pages/RegistrationRejectionForm.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

const API_BASE_URL = "https://new-hope-e46616a5d911.herokuapp.com";

const RegistrationRejectionForm = () => {
  const [formData, setFormData] = useState({
    district: "",
    sectionArea: "",
    registrationCentreCode: "",
    registrationCentreName: "",
    nameOfApplicant: "",
    residentialAddress: "",
    reasonForRejection: "",
    dateOfInquiry: "",
    placeOfInquiry: "",
  });
  
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(true);

  // Function to fetch submissions from the backend.
  const fetchSubmissions = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/registration_rejection_form_submissions`);
      setSubmissions(response.data);
    } catch (error) {
      console.error("Error fetching registration rejection form submissions:", error);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  // Load submissions when component mounts.
  useEffect(() => {
    fetchSubmissions();
  }, []);

  // Handle changes for input fields.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Submit the form to the backend.
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_BASE_URL}/registration_rejection_form_submissions`,
        formData,
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Registration Rejection Form submitted successfully:", response.data);
      alert("Form submitted successfully.");
      // Refresh the submission list after a successful submission.
      fetchSubmissions();
    } catch (error) {
      console.error("Error submitting registration rejection form:", error);
      alert("Error submitting form.");
    }
  };

  // Export all submissions to Excel.
  const exportToExcel = () => {
    if (!submissions || submissions.length === 0) {
      alert("No submissions available to export.");
      return;
    }
    // Map each submission to a simple object for export.
    const exportData = submissions.map(submission => ({
      district: submission.district,
      sectionArea: submission.section_area,
      registrationCentreCode: submission.registration_centre_code,
      registrationCentreName: submission.registration_centre_name,
      nameOfApplicant: submission.name_of_applicant,
      residentialAddress: submission.residential_address,
      reasonForRejection: submission.reason_for_rejection,
      dateOfInquiry: submission.date_of_inquiry,
      placeOfInquiry: submission.place_of_inquiry,
      submittedAt: new Date(submission.submitted_at).toLocaleString(),
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "RRF Submissions");
    XLSX.writeFile(wb, "RegistrationRejectionForm_Submissions.xlsx");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-4">Registration Rejection Form (RRF)</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-3xl bg-gray-50 p-6 rounded-xl shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-1 font-semibold">District</label>
            <input
              type="text"
              name="district"
              className="w-full p-2 border rounded"
              value={formData.district}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Section/Area</label>
            <input
              type="text"
              name="sectionArea"
              className="w-full p-2 border rounded"
              value={formData.sectionArea}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Registration Centre Code</label>
            <input
              type="text"
              name="registrationCentreCode"
              className="w-full p-2 border rounded"
              value={formData.registrationCentreCode}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Registration Centre Name</label>
            <input
              type="text"
              name="registrationCentreName"
              className="w-full p-2 border rounded"
              value={formData.registrationCentreName}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Name of Applicant</label>
            <input
              type="text"
              name="nameOfApplicant"
              className="w-full p-2 border rounded"
              value={formData.nameOfApplicant}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Residential Address</label>
            <input
              type="text"
              name="residentialAddress"
              className="w-full p-2 border rounded"
              value={formData.residentialAddress}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Reason(s) for Rejection</label>
          <textarea
            name="reasonForRejection"
            rows="3"
            className="w-full p-2 border rounded"
            value={formData.reasonForRejection}
            onChange={handleChange}
          />
        </div>
        <div className="flex gap-4 mb-4">
          <div className="w-1/2">
            <label className="block mb-1 font-semibold">Date of Inquiry</label>
            <input
              type="date"
              name="dateOfInquiry"
              className="w-full p-2 border rounded"
              value={formData.dateOfInquiry}
              onChange={handleChange}
            />
          </div>
          <div className="w-1/2">
            <label className="block mb-1 font-semibold">Place of Inquiry</label>
            <input
              type="text"
              name="placeOfInquiry"
              className="w-full p-2 border rounded"
              value={formData.placeOfInquiry}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="mt-4 flex gap-4">
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded shadow"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={exportToExcel}
            className="px-6 py-2 bg-purple-600 text-white rounded shadow"
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
                  <th className="p-2 border">Section/Area</th>
                  <th className="p-2 border">Reg. Centre Code</th>
                  <th className="p-2 border">Reg. Centre Name</th>
                  <th className="p-2 border">Applicant Name</th>
                  <th className="p-2 border">Residential Address</th>
                  <th className="p-2 border">Reason for Rejection</th>
                  <th className="p-2 border">Date of Inquiry</th>
                  <th className="p-2 border">Place of Inquiry</th>
                  <th className="p-2 border">Submitted At</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission, index) => (
                  <tr key={submission.id}>
                    <td className="p-2 border">{index + 1}</td>
                    <td className="p-2 border">{submission.district}</td>
                    <td className="p-2 border">{submission.section_area}</td>
                    <td className="p-2 border">{submission.registration_centre_code}</td>
                    <td className="p-2 border">{submission.registration_centre_name}</td>
                    <td className="p-2 border">{submission.name_of_applicant}</td>
                    <td className="p-2 border">{submission.residential_address}</td>
                    <td className="p-2 border">{submission.reason_for_rejection}</td>
                    <td className="p-2 border">{submission.date_of_inquiry}</td>
                    <td className="p-2 border">{submission.place_of_inquiry}</td>
                    <td className="p-2 border">{new Date(submission.submitted_at).toLocaleString()}</td>
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

export default RegistrationRejectionForm;
