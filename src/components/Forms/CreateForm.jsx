// src/pages/CreateForm.jsx
import React, { useState } from "react";
import axios from "axios";

const API_BASE_URL = "https://new-hope-8796c77630ff.herokuapp.com";

const EMPTY_FIELD = () => ({
  label: "",
  field_name: "",
  field_type: "text",
  required: false,
  options: [],
});

export default function CreateForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [fields, setFields] = useState([EMPTY_FIELD()]);
  const [saving, setSaving] = useState(false);

  const addField = () => setFields(prev => [...prev, EMPTY_FIELD()]);
  const removeField = (idx) => setFields(prev => prev.filter((_, i) => i !== idx));
  const moveField = (idx, dir) => {
    setFields(prev => {
      const arr = [...prev];
      const swap = dir === "up" ? idx - 1 : idx + 1;
      if (swap < 0 || swap >= arr.length) return arr;
      [arr[idx], arr[swap]] = [arr[swap], arr[idx]];
      return arr;
    });
  };
  const updateField = (idx, patch) =>
    setFields(prev => prev.map((f,i) => i === idx ? { ...f, ...patch } : f));

  const addOption = (idx) => {
    const val = prompt("Add an option value:");
    if (!val) return;
    updateField(idx, { options: [...(fields[idx].options || []), val] });
  };
  const removeOption = (idx, optIdx) => {
    const next = [...(fields[idx].options||[])];
    next.splice(optIdx,1);
    updateField(idx, { options: next });
  };

  const handleSave = async () => {
    if (!name.trim()) return alert("Form name is required.");
    if (fields.length === 0) return alert("Add at least one field.");
    for (const f of fields) {
      if (!f.label.trim()) return alert("Each field needs a label.");
      if (f.field_type === "select" && (!f.options || f.options.length === 0)) {
        return alert("Select fields require at least one option.");
      }
    }

    setSaving(true);
    try {
      const payload = {
        name: name.trim(),
        description: description || "",
        fields: fields.map(f => ({
          label: f.label.trim(),
          field_name: f.field_name.trim() || undefined, // server will slugify if empty
          field_type: f.field_type,
          required: !!f.required,
          options: f.field_type === "select" ? f.options : undefined
        }))
      };
      const { data } = await axios.post(`${API_BASE_URL}/forms/templates`, payload, {
        headers: { "Content-Type": "application/json" },
      });
      alert(`Form "${data?.template?.name || name}" created!`);
      // reset
      setName("");
      setDescription("");
      setFields([EMPTY_FIELD()]);
    } catch (e) {
      console.error("Error creating form:", e?.response?.data || e?.message);
      alert(e?.response?.data?.error || "Failed to create form.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Create Form</h1>

        <div className="border rounded-xl p-5 mb-6">
          <label className="block font-semibold mb-1">Form Name</label>
          <input
            className="w-full border rounded p-2 mb-4"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Volunteer Intake"
          />
          <label className="block font-semibold mb-1">Description (optional)</label>
          <textarea
            className="w-full border rounded p-2"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what this form collects..."
          />
        </div>

        <div className="border rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold">Fields</h2>
            <button onClick={addField} className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
              + Add Field
            </button>
          </div>

          {fields.map((f, idx) => (
            <div key={idx} className="border rounded-lg p-4 mb-4">
              <div className="flex justify-between mb-3">
                <strong>Field #{idx + 1}</strong>
                <div className="flex gap-2">
                  <button onClick={() => moveField(idx, "up")} className="px-2 py-1 bg-gray-200 rounded">↑</button>
                  <button onClick={() => moveField(idx, "down")} className="px-2 py-1 bg-gray-200 rounded">↓</button>
                  {fields.length > 1 && (
                    <button onClick={() => removeField(idx)} className="px-2 py-1 bg-red-600 text-white rounded">Remove</button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Label</label>
                  <input
                    className="w-full border rounded p-2"
                    value={f.label}
                    onChange={(e) => updateField(idx, { label: e.target.value })}
                    placeholder="e.g. Full Name"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Field Name (optional)</label>
                  <input
                    className="w-full border rounded p-2"
                    value={f.field_name}
                    onChange={(e) => updateField(idx, { field_name: e.target.value })}
                    placeholder="auto-generated if blank"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Type</label>
                  <select
                    className="w-full border rounded p-2"
                    value={f.field_type}
                    onChange={(e) => updateField(idx, { field_type: e.target.value, options: e.target.value==='select'? (f.options||[]): [] })}
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="date">Date</option>
                    <option value="phone">Phone</option>
                    <option value="textarea">Textarea</option>
                    <option value="select">Select</option>
                    <option value="checkbox">Checkbox</option>
                  </select>
                </div>
              </div>

              <div className="mt-3">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={!!f.required}
                    onChange={(e) => updateField(idx, { required: e.target.checked })}
                  />
                  <span>Required</span>
                </label>
              </div>

              {f.field_type === "select" && (
                <div className="mt-4">
                  <label className="block font-semibold mb-2">Options</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(f.options || []).map((opt, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-100 rounded border">
                        {opt}
                        <button
                          className="ml-2 text-red-600"
                          onClick={() => removeOption(idx, i)}
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => addOption(idx)}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    + Option
                  </button>
                </div>
              )}
            </div>
          ))}

          <div className="mt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Form"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
