import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const API_BASE_URL = "https://new-hope-e46616a5d911.herokuapp.com";

const SkillsDirectoryDashboard = () => {
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    fetchSkills();
  }, []);

  useEffect(() => {
    const results = skills.filter(s =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.skills.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.job_sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.phone_number.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSkills(results);
  }, [searchTerm, skills]);

  const fetchSkills = () => {
    axios.get(`${API_BASE_URL}/skills-directory`)
      .then(res => {
        setSkills(res.data);
        setFilteredSkills(res.data);
      })
      .catch(err => console.error("❌ Error fetching skills:", err));
  };

  const handleExport = () => {
    const data = filteredSkills.map(u => ({
      Name: u.name,
      "Phone Number": u.phone_number,
      Address: u.address,
      Email: u.email,
      "Job Sector": u.job_sector,
      Skills: u.skills,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Skills");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buf], { type: "application/octet-stream" }), "SkillsDirectory.xlsx");
  };

  const handleDeleteRow = async id => {
    if (!window.confirm("Delete this record?")) return;
    const token = localStorage.getItem("token");
    if (!token) return alert("Please log in again.");
    try {
      await axios.delete(`${API_BASE_URL}/skills-directory/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSkills(prev => prev.filter(r => r.id !== id));
      setSelectedIds(prev => prev.filter(pid => pid !== id));
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
        : filteredSkills.map(u => u.id)
    );
  };

  const handleSelectRecord = id => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
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
        selectedIds.map(id =>
          axios.delete(`${API_BASE_URL}/skills-directory/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );
      setSkills(prev => prev.filter(r => !selectedIds.includes(r.id)));
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

      <h2 className="text-2xl font-bold mb-6">Skills Directory</h2>

      <input
        type="text"
        placeholder="Search by Name, Skills, Job Sector or Phone"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="p-3 border border-gray-300 rounded-md mb-6 w-full"
      />

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="text-gray-600 bg-gray-100 border-b">
              <th className="p-3">
                <input
                  type="checkbox"
                  checked={selectedIds.length === filteredSkills.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Phone Number</th>
              <th className="p-3 text-left">Address</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Job Sector</th>
              <th className="p-3 text-left">Skills</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSkills.length === 0 ? (
              <tr>
                <td colSpan="8" className="p-3 text-center text-gray-600">
                  No results found.
                </td>
              </tr>
            ) : (
              filteredSkills.map(user => (
                <tr
                  key={user.id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(user.id)}
                      onChange={() => handleSelectRecord(user.id)}
                    />
                  </td>
                  <td className="p-3 font-medium text-gray-700">
                    {user.name}
                  </td>
                  <td className="p-3 text-gray-600">
                    {user.phone_number}
                  </td>
                  <td className="p-3 text-gray-600">
                    {user.address}
                  </td>
                  <td className="p-3 text-gray-600">
                    {user.email}
                  </td>
                  <td className="p-3 text-gray-600">
                    {user.job_sector}
                  </td>
                  <td className="p-3 text-gray-600">
                    {user.skills}
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

      <button
        onClick={handleExport}
        className="mt-6 px-5 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition"
      >
        Export to Excel
      </button>

      <button
        onClick={handleBulkDelete}
        className="mt-6 ml-4 px-5 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition"
      >
        Delete Selected
      </button>
    </div>
  );
};

export default SkillsDirectoryDashboard;
