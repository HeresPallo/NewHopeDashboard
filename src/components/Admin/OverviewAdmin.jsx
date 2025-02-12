import React from 'react';
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const OverviewAdmin = () => {
  const navigate = useNavigate();
  const [monthlyDelegates, setMonthlyDelegates] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [delegatesRes, campaignsRes, newsRes] = await Promise.all([
          axios.get("http://localhost:5001/monthlydelegates"),
          axios.get("http://localhost:5001/campaigns"),
          axios.get("http://localhost:5001/news"),
        ]);

        setMonthlyDelegates(delegatesRes.data);
        setCampaigns(campaignsRes.data);
        setNews(newsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const delegateGraphData = {
    labels: monthlyDelegates.map(d => d.month),
    datasets: [
      {
        label: "Delegates Engaged",
        data: monthlyDelegates.map(d => d.engaged),
        backgroundColor: "#FF4500",
      },
    ],
  };

  if (loading) return <p className="text-center text-gray-500">Loading dashboard...</p>;

  return (
    <div className="flex-1 p-8 bg-gray-100">
      <h2 className="text-3xl font-semibold text-gray-800">Admin Dashboard</h2>

      {/* Top Metrics */}
      <div className="grid grid-cols-3 gap-6 mt-6">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold text-gray-600">Total Delegates</h3>
          <p className="text-2xl font-bold">{monthlyDelegates.reduce((sum, d) => sum + d.engaged, 0)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold text-gray-600">Active Campaigns</h3>
          <p className="text-2xl font-bold">{campaigns.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold text-gray-600">Total News Posts</h3>
          <p className="text-2xl font-bold">{news.length}</p>
        </div>
      </div>

      {/* Delegates Insight Graph */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h3 className="text-xl font-semibold text-gray-700">Delegates Insight</h3>
        <Bar data={delegateGraphData} />
      </div>

      {/* Grid Layout for Campaigns & News */}
      <div className="grid grid-cols-2 gap-6 mt-6">
        {/* Campaigns Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Current Campaigns</h3>
          <div className="space-y-4">
            {campaigns.slice(0, 3).map(campaign => (
              <div key={campaign.id} className="bg-gray-100 p-4 rounded-lg shadow-sm hover:bg-gray-200 transition">
                <h4 className="text-lg font-bold text-gray-800">{campaign.name}</h4>
                <p className="text-gray-600">Target: ${campaign.target_amount.toLocaleString()}</p>
              </div>
            ))}
            <button onClick={() => navigate("/fundraiser/viewcampaigns")} className="text-blue-500 font-semibold mt-2">View All →</button>
          </div>
        </div>

        {/* News Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Latest News</h3>
          <div className="space-y-4">
            {news.slice(0, 3).map(post => (
              <div key={post.id} onClick={() => navigate(`/newsdashboard`)} className="bg-gray-100 p-4 rounded-lg shadow-sm hover:bg-gray-200 transition cursor-pointer">
                <h4 className="text-lg font-bold text-gray-800">{post.title}</h4>
                <p className="text-gray-600">{post.content.substring(0, 80)}...</p>
              </div>
            ))}
            <button onClick={() => navigate("/newsdashboard")} className="text-blue-500 font-semibold mt-2">View All →</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewAdmin;
