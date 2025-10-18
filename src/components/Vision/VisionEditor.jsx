import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://new-hope-8796c77630ff.herokuapp.com";

export default function VisionEditor() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(""); // ← renamed from "body"
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${API}/vision`);
        if (data) {
          setTitle(data.title || "");
          setContent(data.body || ""); // ← server still returns "body"
          setImageUrl(data.image_url || null);
        }
      } catch (e) {
        console.error("Vision load:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onSave = async () => {
    try {
      setSaving(true);

      const form = new FormData();
      if (title.trim()) form.append("title", title.trim());
      if (content.trim()) form.append("body", content.trim()); // ← send as "body" to backend
      form.append("updated_by", "admin");
      if (imageFile) form.append("image", imageFile);

      const token = localStorage.getItem("token");

      const res = await axios.put(`${API}/vision`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      // reflect any new image key/url from backend
      setImageUrl(res.data.record?.image_url || imageUrl);
      alert("Saved.");
    } catch (e) {
      console.error("Vision save:", e);
      alert(e?.response?.data?.error || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Loading…</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-md shadow-sm">
      <h2 className="text-2xl font-bold mb-4">Dr. Marah’s Vision</h2>

      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Vision"
          className="w-full max-h-64 object-cover object-top rounded mb-4"
        />
      ) : (
        <div className="border rounded p-4 text-gray-500 mb-4">No image set.</div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-semibold mb-1">Change Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold mb-1">Title</label>
        <input
          className="w-full border rounded p-3"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold mb-1">
          Body (Markdown/Plain text)
        </label>
        <textarea
          className="w-full border rounded p-3 h-64"
          value={content} // ← use content
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write the vision here…"
        />
      </div>

      <button
        onClick={onSave}
        disabled={saving}
        className="px-5 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save"}
      </button>
    </div>
  );
}
