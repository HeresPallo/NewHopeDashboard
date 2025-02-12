import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ViewSurvey = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Get survey ID from URL
    const [survey, setSurvey] = useState(null);
    const [responses, setResponses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        // Fetch Survey Details
        axios.get(`http://localhost:5001/surveys/${id}`)
            .then(response => setSurvey(response.data))
            .catch(() => setErrorMessage("Survey not found."));

        // Fetch Responses for this Survey
        axios.get(`http://localhost:5001/surveyresponses/${id}`)
            .then(response => setResponses(response.data))
            .catch(() => setErrorMessage("No responses found for this survey."));

        setLoading(false);
    }, [id]);

     // ✅ Handle Delete Survey
     const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this survey?")) return;

        try {
            await axios.delete(`http://localhost:5001/surveys/${id}`);
            alert("Survey deleted successfully!");
            navigate("/contactsdashboard"); // Redirect after delete
        } catch (error) {
            console.error("❌ Error deleting survey:", error);
            alert("Failed to delete survey.");
        }
    };

    if (loading) return <p>Loading survey details...</p>;
    if (!survey) return <p className="text-red-500">Survey not found.</p>;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
        <button onClick={() => navigate("/fundraiser")} className="text-blue-500 hover:underline mb-4">
        ← Back
      </button>
            <h2 className="text-2xl font-semibold">{survey.title}</h2>
            <p className="text-gray-600 mb-4">{survey.description}</p>

            {/* 📊 Respondents Table */}
            <h3 className="text-lg font-semibold mt-6">Survey Responses</h3>
            <div className="bg-white shadow-sm border rounded-lg mt-4">
                <table className="w-full border-collapse text-sm">
                    <thead>
                        <tr className="text-gray-600 bg-gray-100 border-b">
                            <th className="p-3 text-left">Name</th>
                            <th className="p-3 text-left">Phone</th>
                            <th className="p-3 text-left">Responses</th>
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
                                    <td className="p-3">{response.name}</td>
                                    <td className="p-3">{response.phone}</td>
                                    <td className="p-3 text-gray-600">
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
                 {/* 🚨 Delete Button */}
                 <button
                onClick={handleDelete}
                className="px-4 py-2 mt-8 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
                Delete Survey
            </button>
        </div>
    );
};

export default ViewSurvey;
