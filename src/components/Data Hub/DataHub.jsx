import React, { useState, useEffect } from "react";
import axios from "axios";

const DataHubDashboard = () => {
  const [sections, setSections] = useState([]);
  const [jsonError, setJsonError] = useState(null);
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
  
    if (name === "data" && form.type === "comparative") {
      try {
        JSON.parse(value);
        setJsonError(null);
      } catch (err) {
        setJsonError("❌ Invalid JSON format");
      }
    }
  };
  
  const handleSubmit = () => {
    const payload = {
      title: form.title,
      type: form.type,
      data: form.data,
    };

    const request = form.id
      ? axios.put(`${API_URL}/${form.id}`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      : axios.post(API_URL, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });      

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

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this section?")) return;
  
    axios
      .delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      .then(() => {
        alert("Section deleted.");
        return axios.get(API_URL);
      })
      .then((res) => setSections(res.data))
      .catch((err) => {
        console.error("❌ Error deleting section:", err);
        alert("Failed to delete section.");
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
        {jsonError && (
  <p className="text-sm text-red-600 mt-2">{jsonError}</p>
)}

<div className="mt-4 flex gap-4">
<button
  onClick={handleSubmit}
  disabled={jsonError}
  className={`px-6 py-2 font-semibold rounded ${
    jsonError
      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
      : "bg-red-600 text-white hover:bg-red-700"
  }`}
>
  {form.id ? "Update Section" : "+ Add Section"}
</button>

  {form.id && (
    <button
      onClick={() =>
        setForm({ id: null, title: "", type: "text", data: "" })
      }
      className="px-6 py-2 bg-gray-300 text-gray-800 font-semibold rounded hover:bg-gray-400"
    >
      Cancel
    </button>
  )}
</div>

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
            <button
  onClick={() => handleDelete(section.id)}
  className="text-red-600 hover:underline text-sm ml-4"
>
  Delete
</button>

          </div>
        ))}
      </div>
      
      <div className="mt-10 p-6 border rounded-md bg-blue-50">
  <h3 className="text-lg font-semibold text-blue-800 mb-2">🧠 How to Format Comparative Data</h3>
  <p className="text-sm text-gray-700 mb-2">
    If you're creating a <strong>Comparative Analysis</strong> section (type = <code>"comparative"</code>), your <code>data</code> must be valid JSON with these keys:
  </p>

  <ul className="list-disc list-inside text-sm text-gray-700 mb-4">
    <li><code>commodities</code>: an array of commodity price comparisons</li>
    <li><code>exchange_2017</code> and <code>exchange_2025</code>: numbers for the currency chart</li>
    <li><code>public_debt</code>: array of debt values for 2017, 2020, and 2025</li>
    <li><code>commentary_prices</code>, <code>commentary_exchange</code>, <code>commentary_debt</code>: brief explanation texts</li>
  </ul>

  <p className="text-sm text-gray-700 font-semibold">Example (Public Debt only):</p>
  <pre className="bg-white text-sm text-gray-800 border p-3 mt-2 overflow-x-auto rounded">
{`{
  "public_debt": [16, 27.34, 40],
  "commentary_debt": "Between 2017 and 2025, Sierra Leone’s public debt rose from 16 trillion Le to an estimated 40 trillion Le. The debt-to-GDP ratio climbed from 55.2% to 78%, raising concerns about fiscal sustainability and limiting government investment capacity.",
  "commodities": [],
  "exchange_2017": 0,
  "exchange_2025": 0,
  "commentary_prices": "",
  "commentary_exchange": ""
}`}
  </pre>
</div>

    </div>
  );
};

export default DataHubDashboard;
