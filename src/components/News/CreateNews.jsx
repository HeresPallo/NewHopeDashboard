import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateNews = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  let defaultStatus = "user";

  if (token) {
    const decodedToken = decodeJwt(token);
    defaultStatus = decodedToken && decodedToken.role === "admin" ? "admin" : "user";
  }

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    status: defaultStatus,
    thumbnail: null,
    showSkillsLink: false,  // Add the showSkillsLink field here
  });

  const categories = [
    "Art", "Business", "Culture", "Education",
    "Economy", "Elderly Care", "Entertainment", "Environment",
    "Health", "Labor", "Local News", "Other",
    "Political Support", "Presidential Campaign", "Science", "Social Issues",
    "Sports", "Technology", "Transportation", "Youth"
  ];
  const statuses = ["admin", "user"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevState) => ({ ...prevState, thumbnail: file }));
  };

  // Insert the link to the SubmitSkillsScreen into the content
  const handleInsertLink = () => {
    const submitSkillsLink = `<a href="/submit-skills" target="_blank">Submit your skills here</a>`;
    setFormData((prevData) => ({
      ...prevData,
      content: prevData.content + submitSkillsLink, // Add the link to the content
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = decodeJwt(token);
      if (decodedToken.exp < Date.now() / 1000) {
        alert("Your session has expired. Please log in again.");
        window.location.href = "/login";
        return;
      }

      try {
        const data = new FormData();
        data.append("title", formData.title);
        data.append("content", formData.content);  // Inserted the link into content
        data.append("category", formData.category);
        data.append("status", formData.status);
        data.append("user_id", decodedToken.id);
        data.append("showSkillsLink", formData.showSkillsLink);  // Send showSkillsLink to the backend
        if (formData.thumbnail) {
          data.append("thumbnail", formData.thumbnail);
        }

        const response = await axios.post("https://new-hope-e46616a5d911.herokuapp.com/news", data, {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`,
          },
        });

        alert("News story created successfully!");
        navigate("/newsdashboard");
      } catch (error) {
        console.error("Error creating news story:", error.response?.data || error.message);
        alert(`Failed to create news: ${error.response?.data?.error || "Unknown Error"}`);
      }
    } else {
      alert("You need to be logged in to create news.");
      window.location.href = "/login";
    }
  };

  // Simple JWT decoder
  function decodeJwt(token) {
    try {
      const payload = token.split('.')[1];
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const decodedPayload = JSON.parse(atob(base64));
      return decodedPayload;
    } catch (e) {
      console.error("Failed to decode token", e);
      return null;
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
      <div className="max-w-3xl w-full bg-gray-100 p-8">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-6">Create News Story</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-gray-700 font-semibold">Post Title</label>
            <input
              type="text"
              name="title"
              onChange={handleChange}
              value={formData.title}
              className="w-full p-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-gray-700 font-semibold">Post Content</label>
            <textarea
              name="content"
              onChange={handleChange}
              value={formData.content}
              className="w-full p-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-red-500 h-32"
              required
            ></textarea>
          </div>

          {/* Button to insert SubmitSkills link */}
          {formData.status === "admin" && (
            <div>
              <button
                type="button"
                onClick={handleInsertLink}
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md"
              >
                Add Skills Submission Link
              </button>
            </div>
          )}

          {/* Category */}
          <div>
            <label className="block text-gray-700 font-semibold">Category</label>
            <select
              name="category"
              onChange={handleChange}
              value={formData.category}
              className="w-full p-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            >
              <option value="">Select a Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-gray-700 font-semibold">Status</label>
            <select
              name="status"
              onChange={handleChange}
              value={formData.status}
              className="w-full p-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            >
              {statuses.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          {/* Upload Thumbnail */}
          <div>
            <label className="block text-gray-700 font-semibold">Upload Thumbnail</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full p-2 border rounded-md focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded file:bg-red-100 file:text-red-600 hover:file:bg-red-200"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition-all"
          >
            Create News
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateNews;
