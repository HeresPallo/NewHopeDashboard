// dashboard/src/pages/VisionEditor.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://new-hope-8796c77630ff.herokuapp.com";

export default function VisionEditor() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const [pillarsText, setPillarsText] = useState("");     // one-per-line
  const [prioritiesText, setPrioritiesText] = useState(""); // one-per-line

  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${API}/vision`);
        if (data) {
          setTitle(data.title || "");
          setBody(data.body || "");
          setImageUrl(data.image_url || null);
          setPillarsText((data.pillars || []).join("\n"));
          setPrioritiesText((data.priorities || []).join("\n"));
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
      form.append("title", title || "");
      form.append("body", body || "");
      form.append("pillars", pillarsText || "");
      form.append("priorities", prioritiesText || "");
      if (imageFile) form.append("image", imageFile);

      const token = localStorage.getItem("token");
      await axios.put(`${API}/vision`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Saved.");
      // refresh image preview if changed:
      if (imageFile) {
        // let the file name reflect in preview quickly
        const url = URL.createObjectURL(imageFile);
        setImageUrl(url);
      }
    } catch (e) {
      console.error("Vision save:", e);
      alert(e.response?.data?.error || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  // preview arrays
  const pillars = pillarsText
    .split("\n")
    .map(s => s.trim())
    .filter(Boolean);

  const priorities = prioritiesText
    .split("\n")
    .map(s => s.trim())
    .filter(Boolean);

  if (loading) return <div className="p-8">Loading…</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-md shadow-sm">
      <h2 className="text-2xl font-bold mb-6">Dr. Marah’s Vision — Editor</h2>

      {/* Header image */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Vision"
          className="w-full max-h-64 object-cover object-top rounded mb-4"
        />
      ) : (
        <div className="border rounded p-4 text-gray-500 mb-4">No image set.</div>
      )}
      <div className="mb-5">
        <label className="block text-sm font-semibold mb-1">Change Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        />
      </div>

      {/* Title/Body */}
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
        <label className="block text-sm font-semibold mb-1">Body</label>
        <textarea
          className="w-full border rounded p-3 h-32"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write the vision introduction here…"
        />
      </div>

      {/* Pillars / Priorities editors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-semibold mb-1">
            Core Pillars (one per line)
          </label>
          <textarea
            className="w-full border rounded p-3 h-40"
            value={pillarsText}
            onChange={(e) => setPillarsText(e.target.value)}
            placeholder={`Economic Growth\nInfrastructure Development\nYouth & Women Empowerment\nGood Governance & Accountability\nNational Unity`}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">
            Policy Priorities (one per line)
          </label>
          <textarea
            className="w-full border rounded p-3 h-40"
            value={prioritiesText}
            onChange={(e) => setPrioritiesText(e.target.value)}
            placeholder={`Economic Renewal\nEducation & Health\nJustice & Governance\nYouth & Women Empowerment\nInfrastructure & Connectivity\nClimate & Environment`}
          />
        </div>
      </div>

      <button
        onClick={onSave}
        disabled={saving}
        className="px-5 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save"}
      </button>

      {/* Live Preview */}
      <div className="mt-10">
        <h3 className="text-xl font-bold mb-3">Preview</h3>
        <div className="bg-white border rounded p-4">
          <h4 className="text-lg font-semibold">{title}</h4>
          <p className="text-gray-700 mt-2">{body}</p>

          {/* Cards */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {pillars.map((p, i) => (
              <div key={`pillar-${i}`} className="border rounded-lg p-4 hover:shadow">
                <div className="font-semibold">Pillar</div>
                <div className="mt-1">{p}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {priorities.map((p, i) => (
              <div key={`priority-${i}`} className="border rounded-lg p-4 hover:shadow">
                <div className="font-semibold">Priority</div>
                <div className="mt-1">{p}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
