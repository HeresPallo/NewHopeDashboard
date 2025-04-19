import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateNews = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  let defaultStatus = "user";
  if (token) {
    const decoded = decodeJwt(token);
    defaultStatus = decoded?.role === "admin" ? "admin" : "user";
  }

  const [formData, setFormData] = useState({
    title: "", content: "", category: "", status: defaultStatus,
    thumbnail: null, showSkillsLink: false,
  });
  const [mobileButtons, setMobileButtons] = useState([]); // <-- new
  const [btnLabel, setBtnLabel] = useState("");
  const [btnRoute, setBtnRoute] = useState("");

  const categories = [ /* …your categories… */ ];
  const statuses  = ["admin","user"];

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(f => ({
      ...f,
      [name]: type==="checkbox" ? checked : value
    }));
  };

  const handleFileChange = e => {
    setFormData(f => ({ ...f, thumbnail: e.target.files[0] }));
  };

  // add one mobile‐button
  const addMobileButton = () => {
    if (!btnLabel||!btnRoute) return alert("Label + Route required");
    setMobileButtons(mb => [...mb, { label:btnLabel, route:btnRoute }]);
    setBtnLabel(""); setBtnRoute("");
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!token) {
      alert("Login required"); return navigate("/login");
    }
    try {
      const decoded = decodeJwt(token);
      const data = new FormData();
      data.append("title", formData.title);
      data.append("content", formData.content);
      data.append("category", formData.category);
      data.append("status", formData.status);
      data.append("user_id", decoded.id);
      data.append("showSkillsLink", formData.showSkillsLink);
      // send your mobileButtons as JSON
      data.append("mobile_buttons", JSON.stringify(mobileButtons));
      if (formData.thumbnail) data.append("thumbnail", formData.thumbnail);

      await axios.post(
        "https://new-hope-e46616a5d911.herokuapp.com/news",
        data, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          }
        }
      );
      alert("News created!");
      navigate("/newsdashboard");
    } catch (err) {
      console.error(err);
      alert("Failed: "+(err.response?.data?.error||err.message));
    }
  };

  function decodeJwt(t) {
    try {
      const p=JSON.parse(atob(t.split('.')[1])); return p;
    } catch { return {}; }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      <div className="max-w-3xl w-full bg-gray-100 p-8">
        <h2 className="text-4xl font-bold text-center mb-6">Create News</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label>Post Title</label>
            <input
              name="title" value={formData.title} onChange={handleChange}
              required className="w-full p-3 border rounded"
            />
          </div>

          {/* Content */}
          <div>
            <label>Post Content</label>
            <textarea
              name="content" value={formData.content} onChange={handleChange}
              required className="w-full p-3 border rounded h-32"
            />
          </div>

          {/* showSkillsLink */}
          {formData.status==="admin" && (
            <div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox" name="showSkillsLink"
                  checked={formData.showSkillsLink}
                  onChange={handleChange}
                />
                <span className="ml-2">Show “Submit Skills” button in mobile</span>
              </label>
            </div>
          )}

          {/* Mobile Buttons */}
          {formData.status==="admin" && (
            <div className="space-y-2">
              <h4 className="font-semibold">Mobile Buttons</h4>
              <div className="flex gap-2">
                <input
                  placeholder="Label" value={btnLabel}
                  onChange={e=>setBtnLabel(e.target.value)}
                  className="flex-1 p-2 border rounded"
                />
                <input
                  placeholder="RouteName" value={btnRoute}
                  onChange={e=>setBtnRoute(e.target.value)}
                  className="flex-1 p-2 border rounded"
                />
                <button
                  type="button"
                  onClick={addMobileButton}
                  className="px-4 bg-blue-600 text-white rounded"
                >Add</button>
              </div>
              <ul className="list-disc list-inside">
                {mobileButtons.map((b,i)=>(
                  <li key={i}>{b.label} → {b.route}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Category */}
          <div>
            <label>Category</label>
            <select
              name="category" value={formData.category}
              onChange={handleChange} required
              className="w-full p-3 border rounded"
            >
              <option value="">Select…</option>
              {categories.map(c=>(
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label>Status</label>
            <select
              name="status" value={formData.status}
              onChange={handleChange} required
              className="w-full p-3 border rounded"
            >
              {statuses.map(s=>(
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Thumbnail */}
          <div>
            <label>Upload Thumbnail</label>
            <input
              type="file" onChange={handleFileChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-red-600 text-white rounded"
          >Create News</button>
        </form>
      </div>
    </div>
  );
};

export default CreateNews;
