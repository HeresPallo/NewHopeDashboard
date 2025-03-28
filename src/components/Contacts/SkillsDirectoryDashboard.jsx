import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const API_BASE_URL = "https://new-hope-e46616a5d911.herokuapp.com";

const SkillsDirectoryDashboard = () => {
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State to store search query
  const [filteredSkills, setFilteredSkills] = useState([]); // State for filtered skills based on search
  const [selectedIds, setSelectedIds] = useState([]); // State to store selected records for deletion

  useEffect(() => {
    fetchSkills();
  }, []);

  useEffect(() => {
    // Filter skills based on search term
    const results = skills.filter(skill => 
      skill.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      skill.skills.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSkills(results);
  }, [searchTerm, skills]); // Re-run when searchTerm or skills change

  const fetchSkills = () => {
    axios.get(`${API_BASE_URL}/skills-directory`)
      .then(response => {
        setSkills(response.data);
        setFilteredSkills(response.data); // Initialize filteredSkills
      })
      .catch(error => console.error("❌ Error fetching skills:", error));
  };

  // Export to Excel
  const handleExport = () => {
    const data = filteredSkills.map(user => ({
      Name: user.name,
      Address: user.address,
      Email: user.email,
      "Date of Birth": new Date(user.date_of_birth).toLocaleDateString(),
      Skills: user.skills,
      Resume: user.resume ? user.resume : "No Resume",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Skills");
    
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(dataBlob, "SkillsDirectory.xlsx");
  };

  // Delete entire skills record
  const handleDeleteRow = async (recordId) => {
    if (!window.confirm("Are you sure you want to delete this skills record?")) return;
  
    try {
      const token = localStorage.getItem("token");
      console.log("Token used for deletion:", token);
      if (!token) {
        alert("No token found. Please log in again.");
        return;
      }
      
      await axios.delete(`${API_BASE_URL}/skills-directory/${recordId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Skills record deleted successfully!");
      setSkills(prevSkills => prevSkills.filter(record => record.id !== recordId));
    } catch (error) {
      console.error("❌ Error deleting skills record:", error.response?.data || error.message);
      alert("Failed to delete skills record.");
    }
  };

  // Handle bulk select/unselect
  const handleSelectAll = () => {
    if (selectedIds.length === filteredSkills.length) {
      // Deselect all
      setSelectedIds([]);
    } else {
      // Select all
      const allIds = filteredSkills.map((skill) => skill.id);
      setSelectedIds(allIds);
    }
  };

  // Handle select/unselect individual record
  const handleSelectRecord = (id) => {
    setSelectedIds((prevSelectedIds) => {
      if (prevSelectedIds.includes(id)) {
        // Remove the id from selectedIds
        return prevSelectedIds.filter((selectedId) => selectedId !== id);
      } else {
        // Add the id to selectedIds
        return [...prevSelectedIds, id];
      }
    });
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      alert("Please select at least one record to delete.");
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete the selected records?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in again.");
        return;
      }

      // Perform bulk delete by passing selectedIds
      await Promise.all(
        selectedIds.map((id) =>
          axios.delete(`${API_BASE_URL}/skills-directory/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );

      alert("Selected skills records deleted successfully!");
      // Remove deleted records from the local state
      setSkills(prevSkills => prevSkills.filter(record => !selectedIds.includes(record.id)));
      setSelectedIds([]); // Clear the selectedIds
    } catch (error) {
      console.error("❌ Error deleting selected skills records:", error.response?.data || error.message);
      alert("Failed to delete selected skills records.");
    }
  };

  return (
    <div className="p-8 bg-white min-h-screen">
      {/* 🔙 Back Button */}
      <button onClick={() => navigate(-1)} className="mb-4 px-4 py-2 text-blue-600 hover:underline">
        ← Back
      </button>

      <h2 className="text-2xl font-bold mb-6">Skills Directory</h2>

      {/* 🔍 Search Bar */}
      <input
        type="text"
        placeholder="Search by Name or Skills"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-3 border border-gray-300 rounded-md mb-6 w-full"
      />

      {/* 📄 Skills Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="text-gray-600 bg-gray-100 border-b">
              <th className="p-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedIds.length === filteredSkills.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Address</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Date of Birth</th>
              <th className="p-3 text-left">Skills</th>
              <th className="p-3 text-left">Resume</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSkills.length === 0 ? (
              <tr>
                <td colSpan="8" className="p-3 text-center text-gray-600">No results found.</td>
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
                  <td className="p-3 font-medium text-gray-700">{user.name}</td>
                  <td className="p-3 text-gray-600">{user.address}</td>
                  <td className="p-3 text-gray-600">{user.email}</td>
                  <td className="p-3 text-gray-600">{new Date(user.date_of_birth).toLocaleDateString()}</td>
                  <td className="p-3 text-gray-600">{user.skills}</td>
                  <td className="p-3 text-gray-600">
                    {user.resume ? (
                      <a href={user.resume} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        Download Resume
                      </a>
                    ) : (
                      <span className="text-gray-400">No Resume</span>
                    )}
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

      {/* 📤 Export Button */}
      <button
        onClick={handleExport}
        className="mt-6 px-5 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition"
      >
        Export to Excel
      </button>

      {/* 📤 Bulk Delete Button */}
      <button
        onClick={handleBulkDelete}
        className="mt-6 px-5 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition"
      >
        Delete Selected
      </button>
    </div>
  );
};

export default SkillsDirectoryDashboard;
