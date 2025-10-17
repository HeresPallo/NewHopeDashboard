import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
const API = "https://new-hope-8796c77630ff.herokuapp.com";

export default function VolunteerDashboard() {
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    try {
      const r = await axios.get(`${API}/volunteers`, { params: { t: Date.now() }});
      setRows(Array.isArray(r.data) ? r.data : []);
    } catch (e) {
      console.error("❌ Fetch volunteers:", e);
      alert("Failed to load volunteers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const filtered = rows.filter(v => {
    const hay = [
      v.first_name, v.last_name, v.email, v.phone_number,
      v.preferred_role, (v.days_available || []).join(" "),
      (v.interests || []).join(" "), v.skills_experience || ""
    ].join(" ").toLowerCase();
    return hay.includes(q.toLowerCase());
  });

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this volunteer?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API}/volunteers/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      });
      setRows(prev => prev.filter(r => r.id !== id));
    } catch (e) {
      console.error("❌ Delete volunteer:", e);
      alert("Delete failed.");
    }
  };

  const exportXlsx = () => {
    const data = filtered.map(v => ({
      "First Name": v.first_name,
      "Last Name": v.last_name,
      Email: v.email,
      Phone: v.phone_number,
      "Date of Birth": v.date_of_birth || "",
      "Preferred Role": v.preferred_role || "",
      "Days Available": (v.days_available || []).join(", "),
      "Start Time": v.available_start || "",
      "End Time": v.available_end || "",
      "Skills/Experience": v.skills_experience || "",
      Interests: (v.interests || []).join(", "),
      "Agreed To Terms": v.terms_agreed ? "Yes" : "No",
      "Created At": new Date(v.created_at).toLocaleString()
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Volunteers");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buf], { type: "application/octet-stream" }), "Volunteers.xlsx");
  };

  return (
    <div className="p-8 bg-white min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Volunteers</h2>

      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Search name, email, role, skills…"
          value={q}
          onChange={e => setQ(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        />
        <button onClick={exportXlsx} className="px-4 py-2 bg-green-600 text-white rounded">
          Export
        </button>
      </div>

      {loading ? (
        <p>Loading…</p>
      ) : filtered.length === 0 ? (
        <p>No results.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Phone</th>
                <th className="p-2 text-left">Role</th>
                <th className="p-2 text-left">Days</th>
                <th className="p-2 text-left">Time</th>
                <th className="p-2 text-left">Interests</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(v => (
                <tr key={v.id} className="border-b">
                  <td className="p-2">{v.first_name} {v.last_name}</td>
                  <td className="p-2">{v.email}</td>
                  <td className="p-2">{v.phone_number}</td>
                  <td className="p-2">{v.preferred_role || "-"}</td>
                  <td className="p-2">{(v.days_available || []).join(", ")}</td>
                  <td className="p-2">{(v.available_start || "-")}–{(v.available_end || "-")}</td>
                  <td className="p-2">{(v.interests || []).join(", ") || "-"}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handleDelete(v.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
