import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import axios from "axios";
import "react-calendar/dist/Calendar.css";

const EngagementCalendar = ({ delegates }) => {
  console.log("Delegates data:", delegates); // Debugging

  const [selectedDate, setSelectedDate] = useState(null);
  const [engagements, setEngagements] = useState([]);
  const [formData, setFormData] = useState({ name: "", time: "", details: "", date: "" });
  const [showModal, setShowModal] = useState(false);

  // ✅ Fetch engagements when delegate is selected
  useEffect(() => {
    if (!delegates.length) return;
    const delegateId = delegates[0]?.id;

    axios.get(`http://localhost:5001/engagements/${delegateId}`)
      .then(response => {
        console.log("📥 Engagements fetched:", response.data);
        setEngagements(response.data);
      })
      .catch(error => console.error("❌ Error fetching engagements:", error));
  }, [delegates]);

  // ✅ Handle Engagement Form Submission
  const handleSubmit = async () => {
    try {
      if (!delegates.length) {
        console.error("No delegates available for engagement.");
        return;
      }

      const delegateId = delegates[0]?.id;
      if (!delegateId) {
        console.error("Delegate ID is undefined.");
        return;
      }

      const newEngagement = {
        date: formData.date || selectedDate?.toISOString().split("T")[0],
        name: formData.name,
        time: formData.time,
        details: formData.details,
        delegate_id: delegateId,
        organ_id: delegates[0]?.organ_id,
      };

      console.log("📤 Sending Engagement Data:", newEngagement);

      const response = await axios.post("http://localhost:5001/engagements", newEngagement);

      setEngagements((prev) => [...prev, response.data.engagement]);
      setShowModal(false);
      setFormData({ name: "", time: "", details: "", date: "" });
    } catch (error) {
      console.error("❌ Error adding engagement:", error);
    }
  };

  // ✅ Handle Engagement Deletion
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/engagements/${id}`);

      // ✅ Remove deleted engagement from state
      setEngagements((prev) => prev.filter((engagement) => engagement.id !== id));
    } catch (error) {
      console.error("❌ Error deleting engagement:", error);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-8 mt-8 shadow-md w-full flex flex-col lg:flex-row gap-8">
      
      {/* 📅 Calendar Section */}
      <div className="w-full lg:w-2/3 bg-gray-100 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">📆 Engagement Calendar</h2>
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <Calendar
            value={selectedDate}
            onClickDay={(date) => {
              setSelectedDate(date);
              setShowModal(true);
            }}
            tileClassName="text-gray-900 text-lg font-semibold rounded-lg p-3 transition-all duration-200 hover:bg-red-500 hover:text-white"
            className="w-full border-none text-gray-700 text-center"
          />
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="mt-6 w-full px-5 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300"
        >
          ➕ Add Engagement
        </button>
      </div>

      {/* 📌 Engagement List Section */}
      <div className="w-full lg:w-1/3 bg-gray-100 p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📜 Upcoming Engagements</h3>
        {engagements.length > 0 ? (
          <ul className="space-y-4">
            {engagements.map((engagement) => (
              <li key={engagement.id} className="p-4 bg-white rounded-lg shadow-sm border-l-4 border-red-500 transition-all hover:bg-gray-50 flex justify-between items-center">
                <div>
                  <p className="text-gray-900 font-bold">{engagement.name}</p>
                  <p className="text-sm text-gray-500">🗓 {engagement.date} | ⏰ {engagement.time}</p>
                  <p className="text-sm text-gray-600">{engagement.details}</p>
                </div>
                <button
                  className="text-red-500 text-lg hover:text-red-700 transition-all"
                  onClick={() => handleDelete(engagement.id)}
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center py-6">No engagements added yet.</p>
        )}
      </div>

      {/* 🔥 Modal for Adding Engagement */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-lg">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">📝 Add Engagement</h3>

            <label className="block text-gray-700 font-medium">📌 Engagement Name</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg mb-3 focus:ring-2 focus:ring-red-400"
              placeholder="e.g., Team Meeting"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />

            <label className="block text-gray-700 font-medium">⏰ Time</label>
            <input
              type="time"
              className="w-full p-3 border rounded-lg mb-3 focus:ring-2 focus:ring-red-400"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            />

            <div className="flex justify-between mt-4">
              <button className="px-4 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all duration-300" onClick={() => setShowModal(false)}>❌ Cancel</button>
              <button className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300" onClick={handleSubmit}>✅ Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EngagementCalendar;
