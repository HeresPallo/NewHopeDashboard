// ShareFormModal.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "https://new-hope-e46616a5d911.herokuapp.com";

const ShareFormModal = ({ formName, onClose, onShare }) => {
  const [password, setPassword] = useState("");
  const [mobileUsers, setMobileUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  // Fetch mobile users on mount
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/mobileusers`)
      .then((response) => {
        const data = response.data;
        if (Array.isArray(data)) {
          setMobileUsers(data);
        } else if (data && Array.isArray(data.users)) {
          setMobileUsers(data.users);
        } else {
          console.error("API response is not in expected format:", data);
          setMobileUsers([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching mobile users:", error);
      });
  }, []);

  const handleUserSelectionChange = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setSelectedUserIds(selected);
  };

  const handleShare = () => {
    if (!password) {
      alert("Please enter a share password.");
      return;
    }
    if (selectedUserIds.length === 0) {
      alert("Please select at least one mobile user.");
      return;
    }
    // Call parent's callback with the form name, password, and selected mobile user IDs.
    onShare(formName, password, selectedUserIds);
    onClose();
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h3 className="text-xl font-bold mb-4">Share {formName}</h3>
        <label className="block mb-2 font-semibold">Select Mobile Users</label>
        <select
          multiple
          className="w-full h-40 border p-2 mb-4"
          value={selectedUserIds}
          onChange={handleUserSelectionChange}
        >
          {mobileUsers.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name} (ID: {user.id})
            </option>
          ))}
        </select>
        <label className="block mb-2 font-semibold">Share Password</label>
        <input
          type="password"
          className="w-full p-2 border rounded mb-4"
          placeholder="Enter share password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex justify-end">
          <button className="px-4 py-2 bg-gray-300 rounded mr-2" onClick={onClose}>
            Cancel
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleShare}>
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareFormModal;
