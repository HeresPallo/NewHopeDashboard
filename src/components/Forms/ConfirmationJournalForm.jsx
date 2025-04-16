import React, { useState } from "react";
import axios from "axios";

const API_BASE_URL = "https://new-hope-e46616a5d911.herokuapp.com";

const ConfirmationJournalForm = () => {
  const [formData, setFormData] = useState({
    district: "",
    centreName: "",
    centreCode: "",
    entries: [{ name: "", confirmationNumber: "", telephone: "", date: "" }],
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
        { name: "", confirmationNumber: "", telephone: "", date: "" },
      ],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send the form data to the backend endpoint.
      const response = await axios.post(
        `${API_BASE_URL}/confirmation_journal_submissions`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("Confirmation Journal submitted successfully:", response.data);
      alert("Form submitted successfully.");
      // Optionally clear your form here
    } catch (error) {
      console.error("Error submitting confirmation journal:", error);
      alert("Error submitting form.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-4">Confirmation Journal</h1>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-gray-50 p-6 rounded-xl shadow-md"
      >
        <div className="flex gap-4 mb-4">
          <div className="w-1/3">
            <label className="block mb-1 font-semibold">District</label>
            <input
              type="text"
              name="district"
              className="w-full p-2 border rounded"
              value={formData.district}
              onChange={(e) =>
                setFormData({ ...formData, district: e.target.value })
              }
            />
          </div>
          <div className="w-1/3">
            <label className="block mb-1 font-semibold">Centre Name</label>
            <input
              type="text"
              name="centreName"
              className="w-full p-2 border rounded"
              value={formData.centreName}
              onChange={(e) =>
                setFormData({ ...formData, centreName: e.target.value })
              }
            />
          </div>
          <div className="w-1/3">
            <label className="block mb-1 font-semibold">Centre Code</label>
            <input
              type="text"
              name="centreCode"
              className="w-full p-2 border rounded"
              value={formData.centreCode}
              onChange={(e) =>
                setFormData({ ...formData, centreCode: e.target.value })
              }
            />
          </div>
        </div>

        <table className="w-full text-left border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">#</th>
              <th className="p-2 border">Name (First, Middle, Last)</th>
              <th className="p-2 border">Confirmation Number</th>
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
            onClick={() => {
              // Optionally, add export functionality (if needed)
              // exportToExcel();
              alert("Export functionality not implemented in mobile view.");
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded shadow"
          >
            Export Excel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConfirmationJournalForm;
