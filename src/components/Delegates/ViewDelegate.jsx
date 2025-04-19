import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiArrowLeft } from 'react-icons/fi';

const API_BASE_URL = "https://new-hope-e46616a5d911.herokuapp.com";

export default function ViewDelegate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [delegate, setDelegate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/delegates/${id}`)
      .then(response => {
        setDelegate(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching delegate details:', error);
        setErrorMessage('Delegate not found.');
        setLoading(false);
      });
  }, [id]);

  const handleDeleteDelegate = async () => {
    if (!window.confirm("Are you sure you want to delete this delegate?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${API_BASE_URL}/delegates/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Delegate deleted successfully!");
      navigate("/delegateorgans");
    } catch (error) {
      console.error("❌ Error deleting delegate:", error);
      alert(error.response?.data?.error || "Failed to delete delegate.");
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading delegate details...</p>;
  if (errorMessage) return <p className="text-center text-red-500">{errorMessage}</p>;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white border border-gray-200 shadow-sm rounded-lg mt-10">

      {/* 🔙 Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-700 hover:text-red-500 font-medium mb-6 transition-all"
      >
        <FiArrowLeft className="mr-2 text-lg" />
        <span className="text-lg">Back</span>
      </button>

      {/* 🎭 Profile Section */}
      <div className="flex flex-col items-center mb-6">
        {delegate.profilepic ? (
          <img
            src={delegate.profilepic}
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
        {/* … all your existing detail blocks exactly as they were … */}
      </div>

      {/* 🔘 Actions */}
      <div className="mt-6 flex justify-end space-x-4">
        <button
          onClick={() => navigate(`/editdelegate/${id}`)}
          className="px-5 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-all"
        >
          Edit Delegate
        </button>
        <button
          onClick={handleDeleteDelegate}
          className="px-5 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-all"
        >
          Delete Delegate
        </button>
      </div>
    </div>
  );
}
