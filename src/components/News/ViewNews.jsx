import React from 'react';
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "https://new-hope-e46616a5d911.herokuapp.com/uploads/";

const ViewNews = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  useEffect(() => {
    // Get the JWT token from localStorage
    const token = localStorage.getItem("token");

    if (token) {
      // Make the GET request with the Authorization header
      axios.get(`https://new-hope-e46616a5d911.herokuapp.com/news/${id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      })
      .then(response => {
        setNews(response.data); // Set the news data if the request is successful
      })
      .catch(error => {
        setErrorMessage("Failed to fetch news story.");
        console.error("Error fetching news:", error);
      });
    } else {
      setErrorMessage("You are not logged in. Please log in first.");
    }
  }, [id]);

  const handleDeleteNews = async () => {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.delete(`https://new-hope-e46616a5d911.herokuapp.com/news/${id}`, { // ✅ Fix: Use `id` directly
            headers: { "Authorization": `Bearer ${token}` }
        });

        console.log("🗑 Deleted News:", response.data);
        alert("News deleted successfully!");
        navigate("/newsdashboard"); // ✅ Redirect after delete
    } catch (error) {
        console.error("❌ Error deleting news:", error.response?.data || error.message);
        alert(`Failed to delete news: ${error.response?.data?.error || "Unknown Error"}`);
    }
};



  if (!news) return <p className="text-center text-gray-500">Loading news story...</p>;

  return (
    <div className="flex flex-col p-8 bg-white min-h-screen max-w-3xl mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center border-b pb-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-800">News Details</h2>
        <button
          onClick={() => navigate(-1)}
          className="text-gray-600 text-sm hover:text-gray-900"
        >
          ← Back
        </button>
      </div>

      {/* News Content */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{news.title}</h1>
        <p className="text-sm text-gray-500 mt-1">Category: <span className="text-gray-700">{news.category}</span></p>
        <p className="text-sm text-gray-500">Status: 
          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${news.status === "admin" ? "bg-gray-900 text-white" : "bg-red-100 text-red-600"}`}>
            {news.status === "admin" ? "Admin" : "User"}
          </span>
        </p>
      </div>

      {/* Thumbnail */}
{news.thumbnail && (
  <img
    src={news.thumbnail} // This should now be a full S3 URL
    alt="News Thumbnail"
    className="w-full h-64 object-cover rounded-md mb-6"
  />
)}
      {/* News Content */}
      <p className="text-gray-700 leading-relaxed">{news.content}</p>

      {/* Action Buttons */}
      <div className="flex space-x-3 mt-6">
        <button
          onClick={() => navigate(`/editnews/${id}`)}
          className="px-5 py-2 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-700 transition"
        >
          Edit News
        </button>
        <button
          onClick={() => handleDeleteNews()}
          className="px-5 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition"
        >
          Delete News
        </button>
      </div>
    </div>
  );
};

export default ViewNews;
