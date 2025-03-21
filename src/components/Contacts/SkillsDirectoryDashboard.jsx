import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const API_BASE_URL = "https://new-hope-e46616a5d911.herokuapp.com";

const SkillsDirectoryDashboard = () => {
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/skills-directory`)
      .then(response => setSkills(response.data))
      .catch(error => console.error("❌ Error fetching skills:", error));
  }, []);

  // ✅ Export to Excel
  const handleExport = () => {
    const data = skills.map(user => ({
      Name: user.name,
      Address: user.address,
      Email: user.email,
      "Date of Birth": new Date(user.date_of_birth).toLocaleDateString(),
      Skills: user.skills,
      Resume: user.resume ? `${API_BASE_URL}/uploads/resumes/${user.resume}` : "No Resume",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Skills");
    
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(dataBlob, "SkillsDirectory.xlsx");
  };

  return (
    <div className="p-8 bg-white min-h-screen">
      {/* 🔙 Back Button */}
      <button onClick={() => navigate(-1)} className="mb-4 px-4 py-2 text-blue-600 hover:underline">
        ← Back
      </button>

      <h2 className="text-2xl font-bold mb-6">Skills Directory</h2>

      {/* 📄 Skills Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="text-gray-600 bg-gray-100 border-b">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Address</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Date of Birth</th>
              <th className="p-3 text-left">Skills</th>
              <th className="p-3 text-left">Resume</th>
            </tr>
          </thead>
          <tbody>
            {skills.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
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

              </tr>
            ))}
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
    </div>
  );
};

export default SkillsDirectoryDashboard;
