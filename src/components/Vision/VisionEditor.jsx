import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";

const API = "https://new-hope-8796c77630ff.herokuapp.com";

// Small helper: try parse JSON, else fall back to raw text
function parseBody(body) {
  try {
    const j = JSON.parse(body);
    if (j && typeof j === "object" && (j.intro || j.groups)) return j;
  } catch {}
  return { intro: body || "", groups: [] };
}

function toBodyJSON(intro, groups) {
  return JSON.stringify({ intro, groups });
}

export default function VisionEditor() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [intro, setIntro] = useState("");
  const [groups, setGroups] = useState([
    { id: "core", name: "Core Pillars", items: [] },
    { id: "policy", name: "Policy Priorities", items: [] },
  ]);

  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${API}/vision`);
        if (data) {
          setTitle(data.title || "");
          setImageUrl(data.image_url || null);
          const parsed = parseBody(data.body || "");
          setIntro(parsed.intro || "");
          if (Array.isArray(parsed.groups)) {
            setGroups((prev) => {
              // ensure we keep our two default groups but fill with data if present
              const byId = Object.fromEntries(prev.map(g => [g.id, g]));
              parsed.groups.forEach(g => { byId[g.id] = g; });
              return Object.values(byId);
            });
          }
        }
      } catch (e) {
        console.error("Vision load:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const addItem = (groupId) => {
    setGroups(gs => gs.map(g => g.id === groupId
      ? { ...g, items: [...g.items, { title: "", text: "" }] }
      : g
    ));
  };

  const updateItem = (groupId, idx, patch) => {
    setGroups(gs => gs.map(g => {
      if (g.id !== groupId) return g;
      const items = g.items.map((it, i) => i === idx ? { ...it, ...patch } : it);
      return { ...g, items };
    }));
  };

  const removeItem = (groupId, idx) => {
    setGroups(gs => gs.map(g => {
      if (g.id !== groupId) return g;
      const items = g.items.filter((_, i) => i !== idx);
      return { ...g, items };
    }));
  };

  const onSave = async () => {
    try {
      setSaving(true);
      const form = new FormData();
      if (title.trim()) form.append("title", title.trim());
      form.append("body", toBodyJSON(intro, groups));
      form.append("updated_by", "admin"); // TODO: inject real user if you have auth user
      if (imageFile) form.append("image", imageFile);

      const res = await axios.put(`${API}/vision`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.record?.image_url) setImageUrl(res.data.record.image_url);
      alert("Saved.");
    } catch (e) {
      console.error("Vision save:", e);
      alert("Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const previewData = useMemo(() => ({ title, imageUrl, intro, groups }), [title, imageUrl, intro, groups]);

  if (loading) return <div className="p-8">Loading…</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-md shadow-sm">
      <h2 className="text-2xl font-bold mb-4">Dr. Marah’s Vision</h2>

      {/* Image */}
      {imageUrl ? (
        <img src={imageUrl} alt="Vision" className="w-full max-h-64 object-cover object-top rounded mb-4" />
      ) : (
        <div className="border rounded p-4 text-gray-500 mb-4">No image set.</div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-semibold mb-1">Change Image</label>
        <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
      </div>

      {/* Title */}
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-1">Title</label>
        <input
          className="w-full border rounded p-3"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />
      </div>

      {/* Intro */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-1">Intro (Plain text)</label>
        <textarea
          className="w-full border rounded p-3 h-28"
          value={intro}
          onChange={(e) => setIntro(e.target.value)}
          placeholder="Short intro paragraph…"
        />
      </div>

      {/* Groups / items */}
      <div className="grid gap-6">
        {groups.map((g) => (
          <div key={g.id} className="border rounded p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">{g.name}</h3>
              <button
                className="px-3 py-1 bg-gray-900 text-white rounded text-sm"
                onClick={() => addItem(g.id)}
              >
                + Add Card
              </button>
            </div>

            {g.items.length === 0 && (
              <p className="text-sm text-gray-500">No cards yet.</p>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              {g.items.map((it, idx) => (
                <div key={idx} className="border rounded p-3">
                  <input
                    className="w-full border rounded p-2 mb-2"
                    placeholder="Card title"
                    value={it.title}
                    onChange={(e) => updateItem(g.id, idx, { title: e.target.value })}
                  />
                  <textarea
                    className="w-full border rounded p-2 h-28"
                    placeholder="Card text"
                    value={it.text}
                    onChange={(e) => updateItem(g.id, idx, { text: e.target.value })}
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                      onClick={() => removeItem(g.id, idx)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={onSave}
          disabled={saving}
          className="px-5 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>

      {/* Live preview */}
      <div className="mt-10 border-t pt-6">
        <h3 className="text-xl font-bold mb-4">Preview</h3>
        <VisionPreview {...previewData} />
      </div>
    </div>
  );
}

function VisionPreview({ title, imageUrl, intro, groups }) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-3">{title}</h1>
      {imageUrl && (
        <img src={imageUrl} alt="Vision" className="w-full max-h-64 object-cover object-top rounded mb-4" />
      )}
      {intro && <p className="text-gray-700 mb-6">{intro}</p>}

      {groups.map((g) => (
        <div key={g.id} className="mb-6">
          <h2 className="text-lg font-semibold mb-3">{g.name}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {g.items.map((it, idx) => (
              <div key={idx} className="rounded border p-4">
                <h4 className="font-semibold mb-1">{it.title}</h4>
                <p className="text-sm text-gray-700">{it.text}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
