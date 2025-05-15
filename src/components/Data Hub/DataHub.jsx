import React, { useState, useEffect } from "react";
import axios from "axios";

const DataHubDashboard = () => {
  const [sections, setSections] = useState([]);
  const [form, setForm] = useState({
    id: null,
    title: "",
    type: "text",
    data: "",
  });

  const API_URL = "https://new-hope-e46616a5d911.herokuapp.com/datahub";

  // Load datahub sections
  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => setSections(res.data))
      .catch((err) => console.error("Error fetching datahub:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const payload = {
      title: form.title,
      type: form.type,
      data: form.data,
    };

    const request = form.id
      ? axios.put(`${API_URL}/${form.id}`, payload)
      : axios.post(API_URL, payload);

    request
      .then((res) => {
        alert(form.id ? "Section updated!" : "Section created!");
        setForm({ id: null, title: "", type: "text", data: "" });
        return axios.get(API_URL);
      })
      .then((res) => setSections(res.data))
      .catch((err) => {
        console.error("❌ Error saving section:", err);
        alert("Failed to save section.");
      });
  };

  const handleEdit = (section) => {
    setForm({
      id: section.id,
      title: section.title,
      type: section.type,
      data: JSON.stringify(section.data, null, 2),
    });
  };

  return (
    <div className="p-8 bg-white min-h-screen">
      <h2 className="text-2xl font-semibold mb-6">📊 Data Hub Manager</h2>

      {/* New/Edit Form */}
      <div className="bg-gray-100 p-6 rounded mb-8">
        <input
          type="text"
          name="title"
          placeholder="Section Title"
          value={form.title}
          onChange={handleChange}
          className="w-full px-4 py-2 mb-4 border rounded"
        />

        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full px-4 py-2 mb-4 border rounded"
        >
          <option value="text">Text</option>
          <option value="comparative">Comparative</option>
        </select>

        <textarea
          name="data"
          placeholder='JSON or plain text. E.g. {"key":"value"}'
          value={form.data}
          onChange={handleChange}
          rows={6}
          className="w-full px-4 py-2 border rounded"
        />

        <button
          onClick={handleSubmit}
          className="mt-4 px-6 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700"
        >
          {form.id ? "Update Section" : "+ Add Section"}
        </button>
      </div>

      {/* Existing Sections List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((section) => (
          <div
            key={section.id}
            className="bg-white border p-4 rounded shadow-sm"
          >
            <h3 className="font-bold text-lg">{section.title}</h3>
            <p className="text-sm text-gray-600 mb-2">Type: {section.type}</p>
            <button
              onClick={() => handleEdit(section)}
              className="text-blue-600 hover:underline text-sm"
            >
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DataHubDashboard;
