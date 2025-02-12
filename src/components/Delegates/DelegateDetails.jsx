import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import DelegatesTable from "./DelegatesTable";
import EngagementCalendar from "../Calendar/EngagementCalendar";
import SupportStatusGraph from "../Graph/SupportStatusGraph";
import { FiArrowLeft } from "react-icons/fi";

const DelegateDetails = () => {
  const { organname } = useParams();
  const navigate = useNavigate();
  const [delegates, setDelegates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!organname) return;

    const fetchDelegates = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/delegateorgans/${encodeURIComponent(organname)}/delegates`
        );
        setDelegates(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching delegates:", error);
        setError("Could not fetch delegate data.");
        setLoading(false);
      }
    };

    fetchDelegates();
  }, [organname]);

  if (loading) return <p className="text-center text-lg text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  const supportStatuses = delegates.map((delegate) => delegate.supportstatus);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col px-6 py-8">
      
      {/* 🔙 Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-700 hover:text-red-600 mb-6 transition-all"
      >
        <FiArrowLeft className="mr-2 text-xl" />
        <span className="text-lg font-medium">Back to Delegate Organs</span>
      </button>

      {/* Section Header */}
      <h1 className="text-4xl font-bold text-gray-900 mb-8">{decodeURIComponent(organname)}</h1>

      {/* Dashboard Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* 📊 Support Status Graph */}
        <div className="col-span-1 md:col-span-1 lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Support Status Overview</h2>
          <SupportStatusGraph supportStatuses={supportStatuses} />
        </div>

        {/* 📅 Engagement Calendar */}
        <div className="col-span-1 md:col-span-1 lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Engagement Calendar</h2>
          <EngagementCalendar delegates={delegates} />
        </div>

        {/* 🏛️ Delegates Table */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Delegate List</h2>
          <DelegatesTable delegates={delegates} />
        </div>

      </div>
    </div>
  );
};

export default DelegateDetails;
