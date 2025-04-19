import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "https://new-hope-e46616a5d911.herokuapp.com";

export default function ShareFormModal({ formName, onClose, onShare }) {
  const [mobileUsers, setMobileUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [password, setPassword] = useState("");

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/mobileusers`)
      .then((r) => setMobileUsers(r.data))
      .catch(console.error);
  }, []);

  const handleShare = () => {
    if (!password) return alert("Please set a share password.");
    if (!selectedUserIds.length) return alert("Please select at least one user.");
    onShare(formName, password, selectedUserIds);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Share {formName}</h2>

        <label className="block mb-2 font-semibold">Password:</label>
        <input
          type="password"
          className="w-full mb-4 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Set a share password"
        />

        <label className="block mb-2 font-semibold">Select Mobile Users:</label>
        <select
          multiple
          className="w-full h-32 mb-4 border p-2"
          value={selectedUserIds}
          onChange={(e) => {
            const opts = Array.from(e.target.selectedOptions).map((o) => o.value);
            setSelectedUserIds(opts);
          }}
        >
          {mobileUsers.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name} (ID: {u.id})
            </option>
          ))}
        </select>

        <div className="flex justify-end">
          <button className="mr-2 px-4 py-2 bg-gray-200 rounded" onClick={onClose}>
            Cancel
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleShare}>
            Share
          </button>
        </div>
      </div>
    </div>
  );
}
