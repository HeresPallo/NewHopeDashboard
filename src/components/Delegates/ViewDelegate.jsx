import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiArrowLeft } from "react-icons/fi";

const API_BASE_URL = "https://new-hope-e46616a5d911.herokuapp.com";

export default function ViewDelegate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [delegate, setDelegate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/delegates/${id}`)
      .then(res => {
        setDelegate(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Delegate not found.");
        setLoading(false);
      });
  }, [id]);

  if (loading)  return <p className="text-center text-gray-500">Loading delegate details…</p>;
  if (error)    return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white border shadow rounded mt-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-700 hover:text-red-500 mb-6"
      >
        <FiArrowLeft className="mr-2" /> Back
      </button>

      <div className="flex flex-col items-center mb-6">
        {delegate.profilepic ? (
          <img
            src={delegate.profilepic}
            alt={`${delegate.name}`}
            className="w-28 h-28 rounded-full object-cover border"
          />
        ) : (
          <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
        <h2 className="text-2xl font-semibold mt-4">{delegate.name}</h2>
        <p className="text-gray-600">{delegate.role}</p>
      </div>

      <div className="grid grid-cols-2 gap-6 text-gray-700">
        {/* existing fields... */}
        <div>
          <span className="text-gray-500 text-sm">📊 Support Status</span><br/>
          <span className={`px-3 py-1 text-xs font-medium rounded-full text-white ${
            delegate.supportstatus === "supports" ? "bg-green-500" :
            delegate.supportstatus === "opposes"  ? "bg-red-500"   : "bg-gray-500"
          }`}>{delegate.supportstatus}</span>
        </div>

        {/* NEW: Engaged */}
        <div>
          <span className="text-gray-500 text-sm">✅ Engaged?</span><br/>
          <span className={`px-3 py-1 text-xs font-medium rounded-full text-white ${
            delegate.engaged ? "bg-green-500" : "bg-red-500"
          }`}>
            {delegate.engaged ? "Yes" : "No"}
          </span>
        </div>

        {/* NEW: Last Engaged */}
        <div>
          <span className="text-gray-500 text-sm">📅 Last Engaged</span><br/>
          <span className="font-medium">
            {delegate.last_engaged
              ? new Date(delegate.last_engaged).toLocaleDateString()
              : "N/A"}
          </span>
        </div>
      </div>

      <div className="mt-6 text-right">
        <button
          onClick={() => navigate(`/editdelegate/${id}`)}
          className="px-5 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Edit Delegate
        </button>
      </div>
    </div>
  );
}