import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const API = 'https://new-hope-e46616a5d911.herokuapp.com';

export default function OverviewAdmin() {
  const navigate = useNavigate();
  const [stats, setStats] = useState([]);
  const [totalDelegates, setTotalDelegates] = useState(0);
  const [campaigns, setCampaigns] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [statsRes, countRes, campRes, newsRes] = await Promise.all([
          axios.get(`${API}/monthly-engagement-stats`),
          axios.get(`${API}/delegates/count`),
          axios.get(`${API}/campaigns`),
          axios.get(`${API}/news`)
        ]);
        setStats(statsRes.data);
        setTotalDelegates(countRes.data.total);
        setCampaigns(campRes.data);
        setNews(newsRes.data);
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p className="text-center">Loading dashboard...</p>;

  // Prepare Bar chart data
  const chartData = {
    labels: stats.map(s => s.month),
    datasets: [
      {
        label: 'Total Created',
        data: stats.map(s => s.total_count),
        backgroundColor: '#36A2EB'
      },
      {
        label: 'Engaged',
        data: stats.map(s => s.engaged_count),
        backgroundColor: '#FF6384'
      }
    ]
  };

  return (
    <div className="p-8 bg-gray-100">
      <h2 className="text-3xl font-semibold mb-6">Admin Dashboard</h2>

      {/* Top KPIs */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded shadow text-center">
          <h3 className="text-gray-600">Total Delegates</h3>
          <p className="text-2xl font-bold">{totalDelegates}</p>
        </div>
        <div className="bg-white p-6 rounded shadow text-center">
          <h3 className="text-gray-600">Active Campaigns</h3>
          <p className="text-2xl font-bold">{campaigns.length}</p>
        </div>
        <div className="bg-white p-6 rounded shadow text-center">
          <h3 className="text-gray-600">News Posts</h3>
          <p className="text-2xl font-bold">{news.length}</p>
        </div>
      </div>

      {/* Engagement Bar Chart */}
      <div className="bg-white p-6 rounded shadow mt-8">
        <h3 className="text-xl font-semibold mb-4">Monthly Engagement</h3>
        <Bar data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
      </div>

      {/* Campaign & News Previews */}
      <div className="grid grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-xl font-semibold mb-4">Campaigns</h3>
          {campaigns.slice(0,3).map(c => (
            <div key={c.id} className="mb-4">
              <h4 className="font-bold">{c.name}</h4>
              <p>Target: ${c.target_amount.toLocaleString()}</p>
            </div>
          ))}
          <button onClick={() => navigate('/fundraiser/viewcampaigns')} className="text-blue-500">View All</button>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-xl font-semibold mb-4">Latest News</h3>
          {news.slice(0,3).map(n => (
            <div key={n.id} className="mb-4">
              <h4 className="font-bold">{n.title}</h4>
              <p>{n.content.slice(0,80)}...</p>
            </div>
          ))}
          <button onClick={() => navigate('/newsdashboard')} className="text-blue-500">View All</button>
        </div>
      </div>
    </div>
  );
}