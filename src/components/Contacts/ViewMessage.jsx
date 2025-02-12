import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ViewMessage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:5001/messages/${id}`)
            .then(response => {
                setMessage(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("❌ Error fetching message:", error);
                setError("Message not found.");
                setLoading(false);
            });
    }, [id]);

    if (loading) return <p className="text-center text-gray-500">Loading message details...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
            {/* 🔙 Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="text-gray-600 hover:text-red-500 font-semibold flex items-center mb-6 transition duration-200"
            >
                ← Back
            </button>

            {/* 📩 Message Details */}
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Message from {message.name}</h2>
            <p className="text-gray-600 text-lg mb-4">📞 {message.phone}</p>

            <div className="bg-gray-50 p-4 rounded-lg shadow-inner border">
                <p className="text-gray-700">{message.message}</p>
            </div>

            <p className="text-gray-500 text-sm mt-4">Received on {new Date(message.created_at).toLocaleString()}</p>

            {/* 💬 Reply Button (Optional for Future Implementation) */}
            {/* <button className="mt-6 w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700">
                Reply to Message
            </button> */}
        </div>
    );
};

export default ViewMessage;
