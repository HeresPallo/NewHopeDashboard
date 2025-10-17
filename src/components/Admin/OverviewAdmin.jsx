import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const API = "https://new-hope-8796c77630ff.herokuapp.com";

export default function OverviewAdmin() {
  const navigate = useNavigate();

  const [stats, setStats] = useState([]);
  const [totalDelegates, setTotalDelegates] = useState(0);

  const [campaigns, setCampaigns] = useState([]);
  const [news, setNews] = useState([]);
  const [newsCount, setNewsCount] = useState(0);

  const [mobileUsersCount, setMobileUsersCount] = useState(0);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // Fetch everything in parallel
        const requests = [
          axios.get(`${API}/monthly-engagement-stats`).catch(() => ({ data: [] })),
          axios.get(`${API}/delegates/count`).catch(async () => {
            // Fallback if /delegates/count not implemented
            try {
              const r = await axios.get(`${API}/delegates`);
              return { data: { total: Array.isArray(r.data) ? r.data.length : 0 } };
            } catch {
              return { data: { total: 0 } };
            }
          }),
          axios.get(`${API}/campaigns`).catch(() => ({ data: [] })),
          // News: try /news (array); some backends return {rows:[]}
          axios.get(`${API}/news`).catch(() => ({ data: [] })),
          // Mobile users: prefer /mobileusers/count, else fallback to /mobileusers
          axios.get(`${API}/mobileusers/count`).catch(async () => {
            try {
              const r = await axios.get(`${API}/mobileusers`);
              return { data: { total: Array.isArray(r.data) ? r.data.length : 0 } };
            } catch {
              return { data: { total: 0 } };
            }
          }),
        ];

        const [statsRes, delegatesCountRes, campRes, newsRes, mobileUsersRes] =
          await Promise.all(requests);

        // Monthly stats -> sorted + labeled
        const formattedStats = (Array.isArray(statsRes.data) ? statsRes.data : [])
          .sort((a, b) => String(a.month).localeCompare(String(b.month)))
          .map((s) => {
            const [year, mon] = String(s.month || "").split("-");
            const label = year && mon
              ? new Date(Number(year), Number(mon) - 1).toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })
              : String(s.month || "");
            return {
              month: s.month,
              label,
              total_count: Number(s.total_count || 0),
              engaged_count: Number(s.engaged_count || 0),
            };
          });

        setStats(formattedStats);

        // Delegates count
        setTotalDelegates(Number(delegatesCountRes?.data?.total || 0));

        // Campaigns
        setCampaigns(Array.isArray(campRes.data) ? campRes.data : []);

        // News list + count (handle array OR {rows:[]})
        const newsArray = Array.isArray(newsRes.data)
          ? newsRes.data
          : Array.isArray(newsRes.data?.rows)
          ? newsRes.data.rows
          : [];
        setNews(newsArray);
        setNewsCount(newsArray.length);

        // Mobile users count
        setMobileUsersCount(Number(mobileUsersRes?.data?.total || 0));
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p className="text-center">Loading dashboard...</p>;

  // Bar Chart Data
  const chartData = {
    labels: stats.map((s) => s.label),
    datasets: [
      {
        label: "Delegates Added",
        data: stats.map((s) => s.total_count),
        backgroundColor: "#36A2EB",
      },
      {
        label: "Delegates Engaged",
        data: stats.map((s) => s.engaged_count),
        backgroundColor: "#FF6384",
      },
    ],
  };

  return (
    <div className="p-8 bg-gray-100">
      <h2 className="text-3xl font-semibold mb-6">Admin Dashboard</h2>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
          <p className="text-2xl font-bold">{newsCount}</p>
        </div>

        <div className="bg-white p-6 rounded shadow text-center">
          <h3 className="text-gray-600">Mobile Users</h3>
          <p className="text-2xl font-bold">{mobileUsersCount}</p>
        </div>
      </div>

      {/* Engagement Bar Chart */}
      <div className="bg-white p-6 rounded shadow mt-8">
        <h3 className="text-xl font-semibold mb-4">Monthly Engagement</h3>
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "top" },
            },
          }}
        />
      </div>

      {/* Campaign & News Previews */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-xl font-semibold mb-4">Campaigns</h3>
          {campaigns.slice(0, 3).map((c) => (
            <div key={c.id} className="mb-4">
              <h4 className="font-bold">{c.name}</h4>
              {"target_amount" in c && (
                <p>Target: ${Number(c.target_amount || 0).toLocaleString()}</p>
              )}
            </div>
          ))}
          <button
            onClick={() => navigate("/fundraiser/viewcampaigns")}
            className="text-blue-500"
          >
            View All
          </button>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-xl font-semibold mb-4">Latest News</h3>
          {news.slice(0, 3).map((n) => (
            <div key={n.id} className="mb-4">
              <h4 className="font-bold">{n.title}</h4>
              {"content" in n && <p>{String(n.content).slice(0, 80)}...</p>}
            </div>
          ))}
          <button onClick={() => navigate("/newsdashboard")} className="text-blue-500">
            View All
          </button>
        </div>
      </div>
    </div>
  );
}
