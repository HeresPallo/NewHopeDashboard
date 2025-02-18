import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const API_BASE_URL = "https://new-hope-e46616a5d911.herokuapp.com"; // Production API URL

const ViewSurvey = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get survey ID from URL
  const [survey, setSurvey] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    // Fetch Survey Details
    axios.get(`${API_BASE_URL}/surveys/${id}`)
      .then(response => setSurvey(response.data))
      .catch(() => setErrorMessage("Survey not found."));

    // Fetch Responses for this Survey
    axios.get(`${API_BASE_URL}/surveyresponses/${id}`)
      .then(response => setResponses(response.data))
      .catch(() => setErrorMessage("No responses found for this survey."));

    setLoading(false);
  }, [id]);

  // Export survey responses to Excel
  const handleExport = () => {
    if (responses.length === 0) {
      alert("No responses available to export.");
      return;
    }

    const data = responses.map(response => ({
      Name: response.name,
      Phone: response.phone,
      Responses: response.answers
        .map(entry => `${entry.question}: ${entry.answer}`)
        .join("; "),
      "Submitted At": new Date(response.created_at).toLocaleString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SurveyResponses");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(dataBlob, "SurveyResponses.xlsx");
  };

  // Handle Delete Survey
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this survey?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/surveys/${id}`);
      alert("Survey deleted successfully!");
      navigate("/contactsdashboard");
    } catch (error) {
      console.error("Error deleting survey:", error);
      alert("Failed to delete survey.");
    }
  };

  if (loading) return <p>Loading survey details...</p>;
  if (!survey) return <p className="text-red-500">Survey not found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded mt-6">
      <button onClick={() => navigate("/contactsdashboard")} className="text-blue-500 hover:underline mb-4">
        ← Back
      </button>
      <h2 className="text-2xl font-semibold mb-2">{survey.title}</h2>
      <p className="text-gray-600 mb-4">{survey.description || "No description available"}</p>

      {/* Respondents Table */}
      <h3 className="text-lg font-semibold mt-6 mb-4">Survey Responses</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm border">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-3 text-left border-r">Name</th>
              <th className="p-3 text-left border-r">Phone</th>
              <th className="p-3 text-left border-r">Responses</th>
              <th className="p-3 text-left">Submitted At</th>
            </tr>
          </thead>
          <tbody>
            {responses.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center text-gray-500 p-4">
                  No responses yet.
                </td>
              </tr>
            ) : (
              responses.map((response) => (
                <tr key={response.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 border-r">{response.name}</td>
                  <td className="p-3 border-r">{response.phone}</td>
                  <td className="p-3 border-r text-gray-600">
                    {response.answers.map((entry, index) => (
                      <div key={index}>
                        <strong>{entry.question}:</strong> {entry.answer}
                      </div>
                    ))}
                  </td>
                  <td className="p-3 text-gray-600">
                    {new Date(response.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Export and Delete Buttons */}
      <div className="flex flex-col md:flex-row gap-4 mt-6">
        <button
          onClick={handleExport}
          className="px-5 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition"
        >
          Export to Excel
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
        >
          Delete Survey
        </button>
      </div>
    </div>
  );
};

export default ViewSurvey;
