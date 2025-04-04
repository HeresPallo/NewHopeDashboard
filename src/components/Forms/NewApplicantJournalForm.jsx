// src/pages/NewApplicantJournalForm.jsx
import React, { useState } from "react";
import * as XLSX from "xlsx";

const NewApplicantJournalForm = () => {
  const [formData, setFormData] = useState({
    district: "",
    centreName: "",
    centreCode: "",
    entries: [
      { name: "", confirmationNumber: "", viuReceiptNumber: "", telephone: "", date: "" },
    ],
  });

  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const updatedEntries = [...formData.entries];
    updatedEntries[index][name] = value;
    setFormData({ ...formData, entries: updatedEntries });
  };

  const addRow = () => {
    setFormData({
      ...formData,
      entries: [
        ...formData.entries,
        { name: "", confirmationNumber: "", viuReceiptNumber: "", telephone: "", date: "" },
      ],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send formData to backend
    console.log("New Applicant Journal Data:", formData);
  };

  // Export the form data as Excel (merging header details with each entry)
  const exportToExcel = () => {
    const exportData = formData.entries.map(entry => ({
      district: formData.district,
      centreName: formData.centreName,
      centreCode: formData.centreCode,
      name: entry.name,
      confirmationNumber: entry.confirmationNumber,
      viuReceiptNumber: entry.viuReceiptNumber,
      telephone: entry.telephone,
      confirmation_date: entry.date,
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "New Applicant Journal");
    XLSX.writeFile(wb, "NewApplicantJournal.xlsx");
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
    </div>
  );
};

export default NewApplicantJournalForm;
