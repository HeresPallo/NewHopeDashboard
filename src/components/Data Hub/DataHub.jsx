import React, { useState, useEffect } from "react";
import axios from "axios";

const RESOLVED_API_BASE = "https://new-hope-8796c77630ff.herokuapp.com";
const api = axios.create({ baseURL: RESOLVED_API_BASE }); // hard-force the new API

export default function DataHubDashboard() {
  const [sections, setSections] = useState([]);
  const [jsonError, setJsonError] = useState(null);
  const [form, setForm] = useState({ id: null, title: "", type: "text", data: "" });

  useEffect(() => {
    console.log("[DataHub] Using API base:", RESOLVED_API_BASE);
    // GET is public — no auth/header => no preflight
    api
      .get("/datahub", { params: { t: Date.now() } })
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
      } catch {
        setJsonError("❌ Invalid JSON format");
      }
    }
  };

  const handleSubmit = () => {
    const token = localStorage.getItem("token") || "";
    const payload = { title: form.title, type: form.type, data: form.data };
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

    const req = form.id
      ? api.put(`/datahub/${form.id}`, payload, { headers })
      : api.post("/datahub", payload, { headers });

    req
      .then(() => {
        alert(form.id ? "Section updated!" : "Section created!");
        setForm({ id: null, title: "", type: "text", data: "" });
        return api.get("/datahub", { params: { t: Date.now() } }); // refresh list
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
      data:
        section.type === "comparative"
          ? JSON.stringify(section.data, null, 2)
          : typeof section.data === "string"
          ? section.data
          : String(section.data ?? ""),
    });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this section?")) return;
    const token = localStorage.getItem("token") || "";
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

    api
      .delete(`/datahub/${id}`, { headers })
      .then(() => api.get("/datahub", { params: { t: Date.now() } }))
      .then((res) => setSections(res.data))
      .catch((err) => {
        console.error("❌ Error deleting section:", err);
        alert("Failed to delete section.");
      });
  };

  return (
    <div className="p-8 bg-white min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">📊 Data Hub Manager</h2>

      <div className="bg-gray-100 p-6 rounded-xl shadow-sm mb-10 max-w-3xl mx-auto">
        <input
          type="text"
          name="title"
          placeholder="Section Title"
          value={form.title}
          onChange={handleChange}
          className="w-full px-4 py-2 mb-4 border rounded-md"
        />

        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full px-4 py-2 mb-4 border rounded-md"
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
          className="w-full px-4 py-2 border rounded-md"
        />

        {jsonError && <p className="text-sm text-red-600 mt-2">{jsonError}</p>}

        <div className="mt-4 flex gap-4">
          <button
            onClick={handleSubmit}
            disabled={!!jsonError}
            className={`px-6 py-2 font-semibold rounded-md transition ${
              jsonError ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-red-600 text-white hover:bg-red-700"
            }`}
          >
            {form.id ? "Update Section" : "+ Add Section"}
          </button>

          {form.id && (
            <button
              onClick={() => setForm({ id: null, title: "", type: "text", data: "" })}
              className="px-6 py-2 bg-gray-300 text-gray-800 font-semibold rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((section) => (
          <div
            key={section.id}
            className="border border-gray-200 rounded-xl p-4 shadow hover:shadow-md transition bg-white"
          >
            <h3 className="font-bold text-lg text-gray-800 mb-1 truncate">{section.title}</h3>
            <p className="text-xs text-gray-500 mb-3 italic">Type: {section.type}</p>
            <div className="flex justify-between">
              <button onClick={() => handleEdit(section)} className="text-blue-600 text-sm hover:underline">
                Edit
              </button>
              <button onClick={() => handleDelete(section.id)} className="text-red-600 text-sm hover:underline">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
