import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5001/uploads/";

const NewsDashboard = () => {
    const navigate = useNavigate();
    const [news, setNews] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5001/news")
            .then(response => setNews(response.data))
            .catch(error => console.error("Error fetching news:", error));
    }, []);

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

            {/* News Table */}
            <div className="bg-white">
                <table className="w-full border-collapse text-sm">
                    <thead>
                        <tr className="text-gray-600 bg-gray-100 border-b">
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
                                <td colSpan="5" className="text-center text-gray-500 p-4">
                                    No news stories available.
                                </td>
                            </tr>
                        ) : (
                            news.map((story) => (
                                <tr key={story.id} className="border-b hover:bg-gray-50">
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
