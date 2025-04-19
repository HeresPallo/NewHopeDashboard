import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiUser, FiPhone, FiMessageCircle, FiSend, FiCheckCircle, FiTrash2 } from 'react-icons/fi';

const API_URL = "https://new-hope-e46616a5d911.herokuapp.com";

const MessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [responses, setResponses] = useState({});
  const [sending, setSending] = useState({});

  useEffect(() => {
    axios.get(`${API_URL}/messages`)
      .then(res => setMessages(res.data))
      .catch(err => console.error("❌ Error fetching messages:", err));
  }, []);

  const handleResponseChange = (id, text) => {
    setResponses(prev => ({ ...prev, [id]: text }));
  };

  const handleSendResponse = async (id) => {
    const responseText = (responses[id] || "").trim();
    if (!responseText) {
      alert("Please enter a response.");
      return;
    }
    setSending(prev => ({ ...prev, [id]: true }));
    try {
      await axios.post(`${API_URL}/messages/${id}/respond`, { response: responseText });
      setMessages(msgs => msgs.map(m =>
        m.id === id ? { ...m, admin_response: responseText } : m
      ));
      setResponses(prev => { const c = { ...prev }; delete c[id]; return c; });
    } catch (err) {
      console.error("❌ Error sending response:", err);
      alert("Failed to send response.");
    } finally {
      setSending(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      await axios.delete(`${API_URL}/messages/${id}`);
      setMessages(msgs => msgs.filter(m => m.id !== id));
    } catch (err) {
      console.error("❌ Error deleting message:", err);
      alert("Failed to delete message.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
     <button onClick={() => navigate("/contactsdashboard")} className="text-blue-500 hover:underline mb-4">
        ← Back
      </button>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">User Messages</h2>
      <div className="space-y-4">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500">No messages yet.</p>
        ) : messages.map(msg => (
          <div key={msg.id} className="relative bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            {/* Delete button */}
            <button
              onClick={() => handleDelete(msg.id)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition"
            >
              <FiTrash2 size={18} />
            </button>

            {/* Header: name & phone */}
            <div className="flex items-center mb-4 space-x-4">
              <div className="flex items-center text-gray-700 space-x-2">
                <FiUser size={20} />
                <span className="font-medium">{msg.name}</span>
              </div>
              <div className="flex items-center text-gray-500 space-x-2">
                <FiPhone size={18} />
                <span>{msg.phone}</span>
              </div>
            </div>

            {/* Message Body */}
            <div className="flex items-start text-gray-800 space-x-3 mb-4">
              <FiMessageCircle size={22} className="mt-1 text-red-500" />
              <p className="leading-relaxed">{msg.message}</p>
            </div>

            {/* Admin response or input */}
            {msg.admin_response ? (
              <div className="flex items-center text-green-700 space-x-2">
                <FiCheckCircle size={18} />
                <span className="italic">“{msg.admin_response}”</span>
              </div>
            ) : (
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:space-x-3">
                <input
                  type="text"
                  placeholder="Type your response…"
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                  value={responses[msg.id] || ''}
                  onChange={e => handleResponseChange(msg.id, e.target.value)}
                />
                <button
                  onClick={() => handleSendResponse(msg.id)}
                  disabled={sending[msg.id]}
                  className="mt-2 sm:mt-0 flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg transition disabled:opacity-50"
                >
                  <FiSend className="mr-2" />
                  {sending[msg.id] ? 'Sending…' : 'Send'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessagesPage;
