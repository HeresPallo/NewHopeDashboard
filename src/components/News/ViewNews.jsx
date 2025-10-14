import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

// -------- API BASE RESOLUTION (Vite / Next / CRA) --------
const RESOLVED_API_BASE =
  (typeof window !== "undefined" && window.__API_BASE__) ||
  import.meta?.env?.VITE_API_BASE ||
  process.env?.NEXT_PUBLIC_API_BASE ||
  process.env?.REACT_APP_API_BASE ||
  "https://new-hope-8796c77630ff.herokuapp.com";

// Optional: local axios instance (not required for the GET we force absolute)
const api = axios.create({ baseURL: RESOLVED_API_BASE });

const ViewNews = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Use ABSOLUTE URL so no rogue baseURL can hijack it
    axios
      .get(`${RESOLVED_API_BASE}/news/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      .then((res) => {
        setNews(res.data);
        setErrorMessage(null);
      })
      .catch((err) => {
        console.error("Error fetching news:", err);
        setErrorMessage(
          err?.response?.data?.error || "Failed to fetch news story."
        );
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleDeleteNews = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to delete news.");
        return;
      }

      const ok = window.confirm("Delete this news story?");
      if (!ok) return;

      await api.delete(`/news/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("News deleted successfully!");
      navigate("/newsdashboard");
    } catch (error) {
      console.error("❌ Error deleting news:", error?.response?.data || error?.message);
      alert(
        `Failed to delete news: ${error?.response?.data?.error || "Unknown Error"}`
      );
    }
  };

  const resolveThumb = (thumb) => {
    if (!thumb) return null;
    return thumb.startsWith("http") ? thumb : `${RESOLVED_API_BASE}/uploads/${thumb}`;
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading news story...</p>;
  }

  if (errorMessage) {
    return (
      <div className="flex flex-col p-8 bg-white min-h-screen max-w-3xl mx-auto">
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-800">News Details</h2>
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 text-sm hover:text-gray-900"
          >
            ← Back
          </button>
        </div>
        <p className="text-red-600">{errorMessage}</p>
      </div>
    );
  }

  if (!news) {
    return (
      <p className="text-center text-gray-500">
        News not found or has been removed.
      </p>
    );
  }

  return (
    <div className="flex flex-col p-8 bg-white min-h-screen max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-800">News Details</h2>
        <button
          onClick={() => navigate(-1)}
          className="text-gray-600 text-sm hover:text-gray-900"
        >
          ← Back
        </button>
      </div>

      {/* Meta */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{news.title}</h1>
        <p className="text-sm text-gray-500 mt-1">
          Category: <span className="text-gray-700">{news.category}</span>
        </p>
        <p className="text-sm text-gray-500">
          Status:
          <span
            className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
              news.status === "admin"
                ? "bg-gray-900 text-white"
                : "bg-red-100 text-red-600"
            }`}
          >
            {news.status === "admin" ? "Admin" : "User"}
          </span>
        </p>
      </div>

      {/* Thumbnail */}
      {resolveThumb(news.thumbnail) && (
        <img
          src={resolveThumb(news.thumbnail)}
          alt="News Thumbnail"
          className="w-full h-64 object-cover rounded-md mb-6"
        />
      )}

      {/* Content */}
      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
        {news.content}
      </p>

      {/* Actions */}
      <div className="flex space-x-3 mt-6">
        <button
          onClick={() => navigate(`/editnews/${id}`)}
          className="px-5 py-2 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-700 transition"
        >
          Edit News
        </button>
        <button
          onClick={handleDeleteNews}
          className="px-5 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition"
        >
          Delete News
        </button>
      </div>
    </div>
  );
};

export default ViewNews;
