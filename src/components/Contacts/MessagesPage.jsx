import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import {
  FiUser,
  FiPhone,
  FiMessageCircle,
  FiSend,
  FiCheckCircle,
  FiTrash2,
  FiPlusCircle,
  FiXCircle
} from 'react-icons/fi';

const API_URL = "https://new-hope-e46616a5d911.herokuapp.com";

const MessagesPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [responses, setResponses] = useState({});
  const [sending, setSending] = useState({});
  const [mobileUsers, setMobileUsers] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newMsg, setNewMsg] = useState("");
  const [targetUser, setTargetUser] = useState("");

  // fetch existing messages
  useEffect(() => {
    axios.get(`${API_URL}/messages`)
      .then(res => setMessages(res.data))
      .catch(err => console.error("❌ Error fetching messages:", err));

    // fetch mobile users for the "create" dropdown
    axios.get(`${API_URL}/mobileusers`)
      .then(res => setMobileUsers(res.data))
      .catch(err => console.error("❌ Error fetching mobile users:", err));
  }, []);

  const handleResponseChange = (id, text) => {
    setResponses(prev => ({ ...prev, [id]: text }));
  };

  const handleSendResponse = async id => {
    const responseText = (responses[id] || "").trim();
    if (!responseText) return alert("Please enter a response.");
    setSending(prev => ({ ...prev, [id]: true }));
    try {
      await axios.post(`${API_URL}/messages/${id}/respond`, { response: responseText });
      setMessages(ms =>
        ms.map(m => (m.id === id ? { ...m, admin_response: responseText } : m))
      );
      setResponses(prev => { const c = { ...prev }; delete c[id]; return c; });
    } catch (err) {
      console.error(err);
      alert("Failed to send response.");
    } finally {
      setSending(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleDelete = async id => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await axios.delete(`${API_URL}/messages/${id}`);
      setMessages(ms => ms.filter(m => m.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete message.");
    }
  };

  // —————— New: create message modal ——————
  const sendNewMessage = async () => {
    if (!targetUser || !newMsg.trim()) {
      return alert("Select a user and type a message.");
    }
    try {
      const res = await axios.post(`${API_URL}/messages/admin`, {
        userId: targetUser,
        message: newMsg
      });
      // just append it into your list so you can see it immediately:
      setMessages(ms => [...ms, res.data.data]);
      setShowCreate(false);
      setNewMsg("");
      setTargetUser("");
      alert("Message sent!");
    } catch (err) {
      console.error(err);
      alert("Failed to send message.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <button
        onClick={() => navigate("/contactsdashboard")}
        className="text-blue-500 hover:underline mb-4"
      >
        ← Back
      </button>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">User Messages</h2>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <FiPlusCircle className="mr-2" /> Create Message
        </button>
      </div>

      {/* create‐message modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">New Message</h3>
              <button onClick={() => setShowCreate(false)}>
                <FiXCircle size={20} />
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">To:</label>
              <select
                className="w-full border p-2 rounded"
                value={targetUser}
                onChange={e => setTargetUser(e.target.value)}
              >
                <option value="">— Select user —</option>
                {mobileUsers.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.phone_number})
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Message:</label>
              <textarea
                rows={4}
                className="w-full border p-2 rounded"
                value={newMsg}
                onChange={e => setNewMsg(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowCreate(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={sendNewMessage}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {messages.length === 0
          ? <p className="text-center text-gray-500">No messages yet.</p>
          : messages.map(msg => (
            <div key={msg.id} className="relative bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <button
                onClick={() => handleDelete(msg.id)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-600"
              >
                <FiTrash2 size={18} />
              </button>

              <div className="flex items-center mb-4 space-x-4">
                <div className="flex items-center text-gray-700 space-x-2">
                  <FiUser size={20} /><span className="font-medium">{msg.name}</span>
                </div>
                <div className="flex items-center text-gray-500 space-x-2">
                  <FiPhone size={18} /><span>{msg.phone}</span>
                </div>
              </div>

              <div className="flex items-start text-gray-800 space-x-3 mb-4">
                <FiMessageCircle size={22} className="mt-1 text-red-500" />
                <p className="leading-relaxed">{msg.message}</p>
              </div>

              {msg.admin_response
                ? (
                  <div className="flex items-center text-green-700 space-x-2">
                    <FiCheckCircle size={18} />
                    <span className="italic">“{msg.admin_response}”</span>
                  </div>
                )
                : (
                  <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:space-x-3">
                    <input
                      type="text"
                      placeholder="Type your response…"
                      className="flex-1 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                      value={responses[msg.id] || ''}
                      onChange={e => handleResponseChange(msg.id, e.target.value)}
                    />
                    <button
                      onClick={() => handleSendResponse(msg.id)}
                      disabled={sending[msg.id]}
                      className="mt-2 sm:mt-0 flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      <FiSend className="mr-2" />
                      {sending[msg.id] ? 'Sending…' : 'Send'}
                    </button>
                  </div>
                )}
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default MessagesPage;
