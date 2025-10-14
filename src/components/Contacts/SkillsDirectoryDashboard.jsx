import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const API_BASE_URL = "https://new-hope-8796c77630ff.herokuapp.com";

const SkillsDirectoryDashboard = () => {
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sectorFilter, setSectorFilter] = useState(""); // NEW
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_BASE_URL}/skills-directory`, {
        params: { t: Date.now() },
      });
      setSkills(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ Error fetching skills:", err);
      setSkills([]);
    } finally {
      setLoading(false);
    }
  };

  // Unique sector list for the dropdown
  const sectors = useMemo(() => {
    const s = new Set();
    skills.forEach((r) => {
      if (r?.job_sector) s.add(r.job_sector);
    });
    return Array.from(s).sort();
  }, [skills]);

  // Filtered list (search + sector)
  const filteredSkills = useMemo(() => {
    const q = (searchTerm || "").toLowerCase();
    return skills.filter((s) => {
      const matchesSearch =
        (s.name || "").toLowerCase().includes(q) ||
        (s.skills || "").toLowerCase().includes(q) ||
        (s.job_sector || "").toLowerCase().includes(q) ||
        (s.phone_number || "").toLowerCase().includes(q) ||
        (s.email || "").toLowerCase().includes(q) ||
        (s.address || "").toLowerCase().includes(q);

      const matchesSector = sectorFilter ? (s.job_sector || "") === sectorFilter : true;
      return matchesSearch && matchesSector;
    });
  }, [skills, searchTerm, sectorFilter]);

  const handleExport = () => {
    const data = filteredSkills.map((u) => ({
      Name: u.name || "",
      "Phone Number": u.phone_number || "",
      Address: u.address || "",
      Email: u.email || "",
      "Job Sector": u.job_sector || "",
      Skills: u.skills || "",
      "Date of Birth": u.date_of_birth || "",
      "Resume URL": u.resume_url || "",
      "Created At": u.created_at ? new Date(u.created_at).toLocaleString() : "",
      "Updated At": u.updated_at ? new Date(u.updated_at).toLocaleString() : "",
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Skills");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buf], { type: "application/octet-stream" }), "SkillsDirectory.xlsx");
  };

  const handleDeleteRow = async (id) => {
    if (!window.confirm("Delete this record?")) return;
    const token = localStorage.getItem("token");
    if (!token) return alert("Please log in again.");
    try {
      await axios.delete(`${API_BASE_URL}/skills-directory/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // remove locally
      const next = skills.filter((r) => r.id !== id);
      setSkills(next);
      setSelectedIds((prev) => prev.filter((pid) => pid !== id));
      alert("Deleted.");
    } catch (err) {
      console.error(err);
      alert("Delete failed.");
    }
  };

  const handleSelectAll = () => {
    setSelectedIds(
      selectedIds.length === filteredSkills.length
        ? []
        : filteredSkills.map((u) => u.id)
    );
  };

  const handleSelectRecord = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      return alert("Select at least one.");
    }
    if (!window.confirm("Delete selected?")) return;
    const token = localStorage.getItem("token");
    if (!token) return alert("Please log in again.");
    try {
      await Promise.all(
        selectedIds.map((id) =>
          axios.delete(`${API_BASE_URL}/skills-directory/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );
      setSkills((prev) => prev.filter((r) => !selectedIds.includes(r.id)));
      setSelectedIds([]);
      alert("Deleted selected.");
    } catch (err) {
      console.error(err);
      alert("Bulk delete failed.");
    }
  };

  return (
    <div className="p-8 bg-white min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 text-blue-600 hover:underline"
      >
        ← Back
      </button>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Skills Directory</h2>
        <div className="space-x-2">
          <button
            onClick={fetchSkills}
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
            title="Reload"
          >
            Reload
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Export to Excel
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <input
          type="text"
          placeholder="Search name, skills, sector, phone, email, address"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-3 border border-gray-300 rounded-md w-full"
        />
        <select
          value={sectorFilter}
          onChange={(e) => setSectorFilter(e.target.value)}
          className="p-3 border border-gray-300 rounded-md w-full"
        >
          <option value="">All Sectors</option>
          {sectors.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button
          onClick={() => {
            setSearchTerm("");
            setSectorFilter("");
          }}
          className="px-4 py-2 border rounded-md hover:bg-gray-50"
        >
          Clear Filters
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="text-gray-600 bg-gray-100 border-b">
              <th className="p-3 w-10">
                <input
                  type="checkbox"
                  checked={
                    filteredSkills.length > 0 &&
                    selectedIds.length === filteredSkills.length
                  }
                  onChange={handleSelectAll}
                />
              </th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Address</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Job Sector</th>
              <th className="p-3 text-left">Skills</th>
              <th className="p-3 text-left">DOB</th>
              <th className="p-3 text-left">Resume</th>
              <th className="p-3 text-left">Created</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="11" className="p-6 text-center text-gray-600">
                  Loading…
                </td>
              </tr>
            ) : filteredSkills.length === 0 ? (
              <tr>
                <td colSpan="11" className="p-6 text-center text-gray-600">
                  No results found.
                </td>
              </tr>
            ) : (
              filteredSkills.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(user.id)}
                      onChange={() => handleSelectRecord(user.id)}
                    />
                  </td>
                  <td className="p-3 font-medium text-gray-700">
                    {user.name || "-"}
                  </td>
                  <td className="p-3 text-gray-600">
                    {user.phone_number || "-"}
                  </td>
                  <td className="p-3 text-gray-600">
                    {user.address || "-"}
                  </td>
                  <td className="p-3 text-gray-600">
                    {user.email || "-"}
                  </td>
                  <td className="p-3 text-gray-600">
                    {user.job_sector || "-"}
                  </td>
                  <td className="p-3 text-gray-600">
                    {user.skills || "-"}
                  </td>
                  <td className="p-3 text-gray-600">
                    {user.date_of_birth || "-"}
                  </td>
                  <td className="p-3">
                    {user.resume_url ? (
                      <a
                        href={user.resume_url}
                        className="text-blue-600 hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Download
                      </a>
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </td>
                  <td className="p-3 text-gray-600">
                    {user.created_at
                      ? new Date(user.created_at).toLocaleString()
                      : "-"}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleDeleteRow(user.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
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

      {/* Bulk actions */}
      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={handleExport}
          className="px-5 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition"
        >
          Export to Excel
        </button>
        <button
          onClick={handleBulkDelete}
          className="px-5 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition"
        >
          Delete Selected
        </button>
      </div>
    </div>
  );
};

export default SkillsDirectoryDashboard;
