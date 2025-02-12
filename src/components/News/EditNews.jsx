import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditNews = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    status: "",
    thumbnail: null,
  });

  const categories = ["Presidential Campaign", "Health", "Education", "Environment", "Elderly Care", "Labor", "Technology", "Political Support"];
  const statuses = ["admin", "user"];

  useEffect(() => {
    axios.get(`http://localhost:5001/news/${id}`)
      .then(response => {
        setFormData(response.data);
      })
      .catch(error => console.error("Error fetching news story:", error));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, thumbnail: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const token = localStorage.getItem("token"); // ✅ Ensure token is included
        const data = new FormData();

        // ✅ Only append non-null values to FormData
        Object.entries(formData).forEach(([key, value]) => {
            if (value) data.append(key, value);
        });

        const response = await axios.patch(`http://localhost:5001/news/${id}`, data, {
            headers: { 
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${token}` // ✅ Include JWT token
            },
        });

        console.log("✅ News Updated:", response.data);
        alert("News story updated successfully!");
        setTimeout(() => navigate("/newsdashboard"), 1000);
    } catch (error) {
        console.error("❌ Error updating news story:", error.response?.data || error.message);
        alert("Failed to update news story.");
    }
};


  return (
    <div className="flex flex-col p-8 bg-white min-h-screen max-w-3xl mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center border-b pb-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Edit News Story</h2>
        <button
          onClick={() => navigate(-1)}
          className="text-gray-600 text-sm hover:text-gray-900"
        >
          ← Back
        </button>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="text-gray-700 block mb-1">Post Title</label>
          <input
            type="text"
            name="title"
            onChange={handleChange}
            value={formData.title}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-red-500"
            required
          />
        </div>

        {/* Content */}
        <div>
          <label className="text-gray-700 block mb-1">Post Content</label>
          <textarea
            name="content"
            onChange={handleChange}
            value={formData.content}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-red-500"
            rows="6"
            required
          ></textarea>
        </div>

        {/* Category */}
        <div>
          <label className="text-gray-700 block mb-1">Category</label>
          <select
            name="category"
            onChange={handleChange}
            value={formData.category}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-red-500"
            required
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="text-gray-700 block mb-1">Status</label>
          <select
            name="status"
            onChange={handleChange}
            value={formData.status}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-red-500"
            required
          >
            {statuses.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        {/* Thumbnail Upload */}
        <div>
          <label className="text-gray-700 block mb-1">Upload Thumbnail</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 mt-6">
          <button
            type="submit"
            className="px-5 py-2 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-700 transition"
          >
            Update News
          </button>
          <button
            onClick={() => navigate(-1)}
            type="button"
            className="px-5 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditNews;
