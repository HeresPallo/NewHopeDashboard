import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import DelegatesTable from "./DelegatesTable";
import EngagementCalendar from "../Calendar/EngagementCalendar";
import SupportStatusGraph from "../Graph/SupportStatusGraph";
import EngagementStatusGraph from "../Graph/EngagementStatusGraph";
import { FiArrowLeft } from "react-icons/fi";

const API_BASE_URL = "https://new-hope-8796c77630ff.herokuapp.com";

function normalizeDelegate(d) {
  return {
    id: d.id,
    name: d.name ?? "Unknown",
    role: d.role ?? "",
    phonenumber: d.phonenumber ?? "",
    email: d.email ?? "",
    address: d.address ?? "",
    constituency: d.constituency ?? "",
    organname: d.organname ?? "",
    supportstatus: (d.supportstatus || "neutral").toLowerCase(),
    engaged: typeof d.engaged === "boolean" ? d.engaged : Boolean(d.engaged),
    last_engaged: d.last_engaged ? new Date(d.last_engaged).toISOString() : null,
    profilepic: d.profilepic || "",
    created_at: d.created_at || null,
  };
}

export default function DelegateDetails() {
  const { organname } = useParams();
  const navigate = useNavigate();
  const [delegates, setDelegates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!organname) return;

    const fetchDelegates = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `${API_BASE_URL}/delegateorgans/${encodeURIComponent(
          organname
        )}/delegates`;
        const res = await axios.get(url);

        const rows = Array.isArray(res.data) ? res.data : [];
        setDelegates(rows.map(normalizeDelegate));
      } catch (err) {
        // If the organ has no delegates yet, treat 404 as empty list instead of a fatal error
        if (err?.response?.status === 404) {
          setDelegates([]);
        } else {
          console.error("Error fetching delegates:", err);
          setError("Could not fetch delegate data.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDelegates();
  }, [organname]);

  if (loading) return <p className="text-center text-lg text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  const supportStatuses = delegates.map((d) => d.supportstatus);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col px-6 py-8">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-700 hover:text-red-600 mb-6 transition-all"
      >
        <FiArrowLeft className="mr-2 text-xl" />
        <span className="text-lg font-medium">Back to Delegate Organs</span>
      </button>

      {/* Header */}
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        {organname ? decodeURIComponent(organname) : "Delegates"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Engagement Overview */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Engagement Overview</h2>
          <EngagementStatusGraph organname={organname} />
        </div>

        {/* Support Status */}
        <div className="col-span-1 md:col-span-1 lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Support Status Overview</h2>
          <SupportStatusGraph supportStatuses={supportStatuses} />
        </div>

        {/* Engagement Calendar */}
        <div className="col-span-1 md:col-span-1 lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Engagement Calendar</h2>
          <EngagementCalendar delegates={delegates} />
        </div>

        {/* Delegates Table */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Delegate List</h2>
          <DelegatesTable delegates={delegates} />
        </div>
      </div>

      {/* Empty state */}
      {delegates.length === 0 && (
        <p className="text-center text-gray-500 mt-6">
          No delegates found for this organ yet.
        </p>
      )}
    </div>
  );
}
