import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";

// -------- API BASE RESOLUTION (works with Vite / Next / CRA) --------
const RESOLVED_API_BASE =
  (typeof window !== 'undefined' && window.__API_BASE__) ||        // runtime escape hatch (set in index.html if needed)
  import.meta?.env?.VITE_API_BASE ||                               // Vite
  process.env?.NEXT_PUBLIC_API_BASE ||                             // Next.js
  process.env?.REACT_APP_API_BASE ||                               // CRA
  "https://new-hope-8796c77630ff.herokuapp.com";                   // fallback

// Create a local axios instance
const api = axios.create({ baseURL: RESOLVED_API_BASE });

// Hard override any bad global/default baseURL that still points to the old host
if (axios.defaults.baseURL && axios.defaults.baseURL.includes("e46616a5d911")) {
  console.warn("[NewsDashboard] Overriding bad global axios.defaults.baseURL:", axios.defaults.baseURL);
  axios.defaults.baseURL = RESOLVED_API_BASE;
}
if (api.defaults.baseURL && api.defaults.baseURL.includes("e46616a5d911")) {
  console.warn("[NewsDashboard] Overriding bad api.defaults.baseURL:", api.defaults.baseURL);
  api.defaults.baseURL = RESOLVED_API_BASE;
}

// --------------------------------------------------------------------

const NewsDashboard = () => {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [selectedNews, setSelectedNews] = useState([]);

  useEffect(() => {
    console.log("[NewsDashboard] API base:", RESOLVED_API_BASE);
    console.log("[NewsDashboard] axios.defaults.baseURL:", axios.defaults.baseURL);

    // Use ABSOLUTE URL here to bypass any rogue axios baseURL/interceptor
    axios
      .get(`${RESOLVED_API_BASE}/news`)
      .then(res => setNews(res.data))
      .catch(err => console.error("Error fetching news:", err));
  }, []);

  const handleSelectNews = (id) => {
    const num = Number(id);
    setSelectedNews(prev =>
      prev.includes(num) ? prev.filter(x => x !== num) : [...prev, num]
    );
  };

  const handleBulkDelete = async () => {
    try {
      if (selectedNews.length === 0) {
        alert("No news selected to delete.");
        return;
      }
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to delete news.");
        return;
      }
      // Uses the instance with our corrected baseURL
      const { data } = await api.delete("/news/bulk", {
        headers: { Authorization: `Bearer ${token}` },
        data: { ids: selectedNews },
      });
      alert(data.message);
      setNews(prev => prev.filter(s => !selectedNews.includes(Number(s.id))));
      setSelectedNews([]);
    } catch (e) {
      console.error("Error deleting selected news:", e);
      alert("Failed to delete selected news.");
    }
  };

  // helper: thumbnail URL (S3 full URL or local uploads)
  const resolveThumb = (thumb) => {
    if (!thumb) return null;
    return thumb.startsWith("http")
      ? thumb
      : `${RESOLVED_API_BASE}/uploads/${thumb}`;
  };

  return (
    <div className="flex flex-col p-8 bg-white min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-xl font-semibold text-gray-800">News Dashboard</h2>
        <button
          onClick={() => navigate("/createnews")}
          className="px-5 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition"
        >
          + Create News
        </button>
      </div>

      {/* Bulk Delete */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={handleBulkDelete}
          className="px-5 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
        >
          Delete Selected News
        </button>
      </div>

      {/* Table */}
      <div className="bg-white">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="text-gray-600 bg-gray-100 border-b">
              <th className="p-3 text-left">
                <input
                  type="checkbox"
                  checked={news.length > 0 && selectedNews.length === news.length}
                  onChange={() =>
                    setSelectedNews(
                      selectedNews.length === news.length ? [] : news.map(s => Number(s.id))
                    )
                  }
                />
              </th>
              <th className="p-3 text-left">Thumbnail</th>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {news.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center text-gray-500 p-4">
                  No news stories available.
                </td>
              </tr>
            ) : (
              news.map((story) => (
                <tr key={story.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedNews.includes(Number(story.id))}
                      onChange={() => handleSelectNews(story.id)}
                    />
                  </td>

                  <td className="p-3">
  {story.thumbnail ? (
    <img
      src={story.thumbnail}
      alt={story.title}
      className="w-14 h-10 object-cover rounded-md"
    />
  ) : (
    <div className="w-14 h-10 bg-gray-200 rounded-md flex items-center justify-center">
      <span className="text-gray-400 text-xs">No Image</span>
    </div>
  )}
</td>

                  <td className="p-3 font-medium text-gray-700">{story.title}</td>
                  <td className="p-3 text-gray-600">{story.category}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        story.status === "admin" ? "bg-gray-900 text-white" : "bg-red-100 text-red-600"
                      }`}
                    >
                      {story.status}
                    </span>
                  </td>

                  <td className="p-3 flex space-x-3">
                    <button
                      onClick={() => navigate(`/news/${story.id}`)}
                      className="text-gray-700 hover:text-gray-900 text-sm"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NewsDashboard;
