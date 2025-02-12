import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiArrowLeft } from "react-icons/fi"; // Back Icon

const ViewDelegate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [delegate, setDelegate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:5001/delegates/${id}`)
            .then(response => {
                setDelegate(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching delegate details:", error);
                setErrorMessage("Delegate not found.");
                setLoading(false);
            });
    }, [id]);

    if (loading) return <p className="text-center text-gray-500">Loading delegate details...</p>;
    if (errorMessage) return <p className="text-center text-red-500">{errorMessage}</p>;

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white border border-gray-200 shadow-sm rounded-lg mt-10">

            {/* 🔙 Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="text-gray-700 hover:text-red-500 font-medium flex items-center mb-6 transition-all"
            >
                <FiArrowLeft className="mr-2 text-lg" />
                <span className="text-lg">Back</span>
            </button>

            {/* 🎭 Profile Section */}
            <div className="flex flex-col items-center mb-6">
                {delegate.profilepic ? (
                    <img
                        src={`http://localhost:5001/${delegate.profilepic}`}
                        alt={`${delegate.name}'s profile`}
                        className="w-28 h-28 rounded-full object-cover border border-gray-300"
                    />
                ) : (
                    <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                        No Image
                    </div>
                )}
                <h2 className="text-2xl font-semibold text-gray-800 mt-4">{delegate.name}</h2>
                <p className="text-gray-600">{delegate.role}</p>
            </div>

            {/* 📜 Delegate Details */}
            <div className="grid grid-cols-2 gap-6 text-gray-700">
                <div className="flex flex-col">
                    <span className="text-gray-500 text-sm">📞 Phone</span>
                    <span className="font-medium">{delegate.phonenumber}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-gray-500 text-sm">✉️ Email</span>
                    <span className="font-medium">{delegate.email}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-gray-500 text-sm">🏡 Address</span>
                    <span className="font-medium">{delegate.address}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-gray-500 text-sm">📍 Constituency</span>
                    <span className="font-medium">{delegate.constituency}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-gray-500 text-sm">🏛️ Organ</span>
                    <span className="font-medium">{delegate.organname}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-gray-500 text-sm">📊 Support Status</span>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full text-white w-fit
                        ${delegate.supportstatus === "supports" ? "bg-green-500" :
                          delegate.supportstatus === "opposes" ? "bg-red-500" :
                          "bg-gray-500"}`}>
                        {delegate.supportstatus}
                    </span>
                </div>
            </div>

            {/* 🔘 Edit Delegate Button */}
            <div className="mt-6 flex justify-end">
                <button
                    onClick={() => navigate(`/editdelegate/${id}`)}
                    className="px-5 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-all"
                >
                    Edit Delegate
                </button>
            </div>
        </div>
    );
};

export default ViewDelegate;
