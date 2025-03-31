import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "https://new-hope-e46616a5d911.herokuapp.com/uploads/";

const NewsDashboard = () => {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [selectedNews, setSelectedNews] = useState([]);

  useEffect(() => {
    axios.get("https://new-hope-e46616a5d911.herokuapp.com/news")
      .then(response => setNews(response.data))
      .catch(error => console.error("Error fetching news:", error));
  }, []);

  // Handle checkbox selection for each story
  const handleSelectNews = (id) => {
    setSelectedNews((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((itemId) => itemId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  // Handle bulk delete of selected news
  const handleBulkDelete = async () => {
    try {
      if (selectedNews.length === 0) {
        alert("No news selected to delete.");
        return;
      }
      const response = await axios.delete("https://new-hope-e46616a5d911.herokuapp.com/news/bulk", {
        data: { ids: selectedNews }
      });
      alert(response.data.message);
      // After deletion, update the UI by fetching the news again
      setNews((prevNews) => prevNews.filter((story) => !selectedNews.includes(story.id)));
      setSelectedNews([]); // Clear selected news
    } catch (error) {
      console.error("Error deleting selected news:", error);
      alert("Failed to delete selected news.");
    }
  };

  return (
    <div className="flex flex-col p-8 bg-white min-h-screen">
      {/* Dashboard Header */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-xl font-semibold text-gray-800">News Dashboard</h2>
        <button
          onClick={() => navigate("/createnews")}
          className="px-5 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition"
        >
          + Create News
        </button>
      </div>

      {/* Bulk Delete Button */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={handleBulkDelete}
          className="px-5 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
        >
          Delete Selected News
        </button>
      </div>

      {/* News Table */}
      <div className="bg-white">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="text-gray-600 bg-gray-100 border-b">
              <th className="p-3 text-left">
                <input
                  type="checkbox"
                  checked={news.length === selectedNews.length}
                  onChange={() => {
                    if (selectedNews.length === news.length) {
                      setSelectedNews([]);
                    } else {
                      setSelectedNews(news.map((story) => story.id));
                    }
                  }}
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
                  {/* Select Checkbox */}
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedNews.includes(story.id)}
                      onChange={() => handleSelectNews(story.id)}
                    />
                  </td>

                  {/* Thumbnail */}
                  <td className="p-3">
                    {story.thumbnail ? (
                      <img src={`${API_BASE_URL}${story.thumbnail}`} alt={story.title} className="w-14 h-10 object-cover rounded-md" />
                    ) : (
                      <div className="w-14 h-10 bg-gray-200 rounded-md flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No Image</span>
                      </div>
                    )}
                  </td>

                  {/* News Details */}
                  <td className="p-3 font-medium text-gray-700">{story.title}</td>
                  <td className="p-3 text-gray-600">{story.category}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${story.status === "admin" ? "bg-gray-900 text-white" : "bg-red-100 text-red-600"}`}>
                      {story.status === "admin" ? "admin" : "user"}
                    </span>
                  </td>

                  {/* Actions */}
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
