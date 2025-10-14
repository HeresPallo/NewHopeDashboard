import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE =
  import.meta?.env?.VITE_API_BASE ||
  process.env.NEXT_PUBLIC_API_BASE ||
  "https://new-hope-8796c77630ff.herokuapp.com";

// very small, safe escape to avoid accidental HTML injection from plain text
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// convert plain text (with blank lines) to HTML paragraphs + <br/>
function textToHtml(text) {
  if (!text || !text.trim()) return "";
  // split on 2+ consecutive newlines to form paragraphs
  const paragraphs = text
    .trim()
    .split(/\n{2,}/)
    .map(block => {
      const safe = escapeHtml(block).replace(/\n/g, "<br/>");
      return `<p>${safe}</p>`;
    });
  return paragraphs.join("");
}

function decodeJwt(t) {
  try {
    const payload = t.split(".")[1];
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
}

const CreateNews = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const storedRole = localStorage.getItem("role");
  const decoded = token ? decodeJwt(token) : null;

  const effectiveRole =
    (decoded && decoded.role) ||
    (storedRole ? storedRole : "user");

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    status: effectiveRole === "admin" ? "admin" : "user",
    thumbnail: null,
    showSkillsLink: false,
  });

  const [mobileButtons, setMobileButtons] = useState([]);
  const [newButtonLabel, setNewButtonLabel] = useState("");
  const [newButtonRoute, setNewButtonRoute] = useState("");

  const categories = [
    "Art","Business","Culture","Education","Economy","Elderly Care",
    "Entertainment","Environment","Health","Labor","Local News",
    "Other","Political Support","Presidential Campaign","Science",
    "Social Issues","Sports","Technology","Transportation","Youth"
  ];
  const statuses = ["admin", "user"];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, thumbnail: e.target.files[0] }));
  };

  const addMobileButton = () => {
    if (!newButtonLabel || !newButtonRoute) return alert("Both label and route required");
    setMobileButtons((prev) => [...prev, { label: newButtonLabel, route: newButtonRoute }]);
    setNewButtonLabel("");
    setNewButtonRoute("");
  };

  const removeMobileButton = (index) => {
    setMobileButtons((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Login required");
      return navigate("/login");
    }
    const dec = decodeJwt(token);
    if (!dec || dec.exp * 1000 < Date.now()) {
      alert("Session expired");
      return navigate("/login");
    }

    try {
      const data = new FormData();
      data.append("title", formData.title);
      // ✨ convert the textarea text into HTML so mobile renders paragraphs nicely
      const htmlContent = textToHtml(formData.content);
      data.append("content", htmlContent);
      data.append("category", formData.category);
      data.append("status", formData.status);
      data.append("showSkillsLink", String(formData.showSkillsLink));
      data.append("mobile_buttons", JSON.stringify(mobileButtons));

      if (formData.thumbnail) {
        data.append("thumbnail", formData.thumbnail);
      }

      await axios.post(`${API_BASE}/news`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("News story created successfully!");
      navigate("/newsdashboard");
    } catch (err) {
      console.error("Create news error:", err?.response?.data || err.message);
      alert("Failed to create news: " + (err?.response?.data?.error || err.message));
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
      <div className="max-w-3xl w-full bg-gray-100 p-8">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-6">Create News Story</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
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

          <div>
            <label className="block text-gray-700 font-semibold">Post Content</label>
            <textarea
              name="content"
              onChange={handleChange}
              value={formData.content}
              placeholder={"Write your post. Use blank lines between paragraphs.\nSingle newlines will be preserved inside a paragraph."}
              className="w-full p-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-red-500 h-40"
              required
            />
          </div>

          {formData.status === "admin" && (
            <div className="flex items-center">
              <input
                type="checkbox"
                name="showSkillsLink"
                checked={formData.showSkillsLink}
                onChange={handleChange}
                className="mr-2"
              />
              <label className="text-gray-700">Include “Submit Skills” Link</label>
            </div>
          )}

          {formData.status === "admin" && (
            <div className="bg-white border p-4 rounded-md">
              <h3 className="font-semibold mb-2">Mobile Buttons</h3>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Button Label"
                  value={newButtonLabel}
                  onChange={(e) => setNewButtonLabel(e.target.value)}
                  className="flex-1 p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Route Name"
                  value={newButtonRoute}
                  onChange={(e) => setNewButtonRoute(e.target.value)}
                  className="flex-1 p-2 border rounded"
                />
                <button type="button" onClick={addMobileButton} className="px-4 py-2 bg-green-600 text-white rounded">
                  Add
                </button>
              </div>
              <ul>
                {mobileButtons.map((btn, i) => (
                  <li key={i} className="flex justify-between mb-1">
                    <span>{btn.label} → {btn.route}</span>
                    <button type="button" onClick={() => removeMobileButton(i)} className="text-red-600">✕</button>
                  </li>
                ))}
              </ul>
            </div>
          )}

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

          <div>
            <label className="block text-gray-700 font-semibold">Status</label>
            <select
              name="status"
              onChange={handleChange}
              value={formData.status}
              className="w-full p-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            >
              {statuses.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Upload Thumbnail</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full p-2 border rounded-md focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded file:bg-red-100 file:text-red-600 hover:file:bg-red-200"
            />
          </div>

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
