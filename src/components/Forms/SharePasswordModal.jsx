// SharePasswordModal.jsx
import React, { useState } from "react";

const SharePasswordModal = ({ formName, onClose, onShare }) => {
  const [password, setPassword] = useState("");

  const handleShare = () => {
    if (!password) {
      alert("Please enter a share password.");
      return;
    }
    // Call the provided callback with the form name and the entered password.
    onShare(formName, password);
    onClose();
  };

  return (
    <div style={modalOverlayStyles}>
      <div style={modalContentStyles}>
        <h3 style={modalHeaderStyles}>Share {formName}</h3>
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter share password" 
          style={inputStyles}
        />
        <div style={buttonContainerStyles}>
          <button style={cancelButtonStyles} onClick={onClose}>Cancel</button>
          <button style={shareButtonStyles} onClick={handleShare}>Share</button>
        </div>
      </div>
    </div>
  );
};

// Inline styles for simplicity
const modalOverlayStyles = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000
};

const modalContentStyles = {
  backgroundColor: "#fff",
  padding: 20,
  borderRadius: 8,
  width: 300,
  textAlign: "center"
};

const modalHeaderStyles = {
  marginBottom: 15
};

const inputStyles = {
  width: "100%",
  padding: 10,
  marginBottom: 15,
  borderRadius: 4,
  border: "1px solid #ddd"
};

const buttonContainerStyles = {
  display: "flex",
  justifyContent: "space-between"
};

const cancelButtonStyles = {
  backgroundColor: "#ccc",
  border: "none",
  padding: "10px 15px",
  borderRadius: 4,
  cursor: "pointer"
};

const shareButtonStyles = {
  backgroundColor: "#28a745",
  color: "#fff",
  border: "none",
  padding: "10px 15px",
  borderRadius: 4,
  cursor: "pointer"
};

export default SharePasswordModal;
