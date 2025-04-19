import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const API_BASE_URL = "https://new-hope-e46616a5d911.herokuapp.com";

const EngagementStatusGraph = ({ organname }) => {
  const [counts, setCounts] = useState({ engaged_count: 0, not_engaged_count: 0 });

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/delegateorgans/${encodeURIComponent(organname)}/engagementCounts`)
      .then(res => setCounts(res.data))
      .catch(err => console.error("❌ Error loading engagementCounts:", err));
  }, [organname]);

  const data = {
    labels: ["Engaged", "Not Engaged"],
    datasets: [{
      data: [counts.engaged_count, counts.not_engaged_count],
      backgroundColor: ["#36A2EB", "#FF6384"],
      hoverOffset: 4
    }]
  };

  return (
    <Pie 
      data={data} 
      options={{
        responsive: true,
        plugins: {
          legend: { position: "bottom" },
          title: { display: false },
        }
      }}
    />
  );
};

export default EngagementStatusGraph;
