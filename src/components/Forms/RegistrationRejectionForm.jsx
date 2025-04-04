// src/pages/RegistrationRejectionForm.jsx
import React, { useState } from "react";
import * as XLSX from "xlsx";

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send formData to backend
    console.log("Registration Rejection Form Data:", formData);
  };

  // Export the form data as Excel (exporting as a single-row array)
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet([formData]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "RRF Data");
    XLSX.writeFile(wb, "RegistrationRejectionForm.xlsx");
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
    </div>
  );
};

export default RegistrationRejectionForm;
